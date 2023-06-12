import { getProductsFromWooCommerce } from '../api/woo-commerce.api';
import { BadRequestError } from '../errors/bad-request.error';
import { NotFoundError } from '../errors/not-found.error';
import {
  deleteProductByIdFromDb,
  getAllProductsCountFromDb,
  getAllProductsFromDb,
  getProductDetailByIdFromDb,
  getProductDetailBySkuFromDb,
  getProductsByIdsFromDb,
  storeProductToDb,
  updateProductFromDb,
} from '../repositories';
import { storeNewProductWithStockToDb } from '../repositories/product-transaction.repository';
import { TOrderBy } from '../types/common/order-by.type';
import { TPaginatedData } from '../types/common/paginated-data.type';
import { TPaginationQuery } from '../types/common/pagination-query.type';
import { TImportProductFromWc } from '../types/product/import-product-from-wc.type';
import { TProductWcQueryParam } from '../types/product/product-wc-query-param.type';
import { TProduct } from '../types/product/product.type';
import { TStoreProduct } from '../types/product/store-product.type';
import { TUpdateProduct } from '../types/product/update-product.type';
import { constructPaginatedData } from '../utils';

export const getAllProducts = async (
  pagination: TPaginationQuery,
  orderBy: TOrderBy
): Promise<TPaginatedData<TProduct>> => {
  const [products, allProductsCount] = await Promise.all([
    getAllProductsFromDb(pagination, orderBy),
    getAllProductsCountFromDb(),
  ]);

  const typedProducts: TProduct[] = products.map((product) => ({
    id: product.id,
    sku: product.sku,
    name: product.name,
    image: product.image,
    price: product.price,
    stock: +product.stock,
  }));

  const paginatedData = constructPaginatedData(
    typedProducts,
    allProductsCount.count,
    pagination
  );

  return paginatedData;
};

export const getProductDetailById = async (
  productId: number
): Promise<TProduct> => {
  const product = await getProductDetailByIdFromDb(productId);
  if (!product) {
    throw new NotFoundError('product not found');
  }

  const typedProduct: TProduct = {
    id: product.id,
    name: product.name,
    sku: product.sku,
    price: +product.price,
    stock: +product.stock,
    image: product.image,
    description: product.description,
  };

  return typedProduct;
};

export const getProductDetailBySku = async (
  sku: string,
  throwError = true
): Promise<TProduct | undefined> => {
  const product = await getProductDetailBySkuFromDb(sku);
  if (!product) {
    if (throwError) {
      throw new NotFoundError('product not found');
    }
    return;
  }

  const typedProduct: TProduct = {
    id: product.id,
    name: product.name,
    sku: product.sku,
    price: +product.price,
    stock: +product.stock,
    image: product.image,
    description: product.description,
  };

  return typedProduct;
};

export const storeProduct = async (payload: TStoreProduct) => {
  const existingProduct = await getProductDetailBySku(
    payload.sku as string,
    false
  );
  if (existingProduct) {
    throw new BadRequestError(
      `product with SKU ${payload.sku} is already exists`
    );
  }

  const result = payload.stock
    ? await storeNewProductWithStockToDb(payload)
    : await storeProductToDb(payload);
  const newProduct = await getProductDetailById(result.id);

  return newProduct;
};

export const updateProduct = async (payload: TUpdateProduct) => {
  const existingProductById = await getProductDetailById(payload.productId);

  if (payload.sku && payload.sku !== existingProductById.sku) {
    const existingProductBySku = await getProductDetailBySku(
      payload.sku,
      false
    );

    if (existingProductBySku) {
      throw new BadRequestError(
        `product with sku ${payload.sku} is already exists`
      );
    }
  }

  const result = await updateProductFromDb(payload);
  const updatedProduct = await getProductDetailById(result.id);

  return updatedProduct;
};

export const deleteProduct = async (productId: number) => {
  await getProductDetailById(productId);

  const result = await deleteProductByIdFromDb(productId);

  return result;
};

export const importProductsFromWooCommerce = async (
  payload: TImportProductFromWc
): Promise<{
  isSuccess: boolean;
  data?: TProduct[];
  errors?: string[];
}> => {
  const params = extractQueryParamsFromPayload(payload);
  const wcProducts = await getProductsFromWooCommerce(params);

  const storePayloads: TStoreProduct[] = wcProducts.map((wcProduct, idx) => {
    return {
      sku: wcProduct.sku,
      name: wcProduct.name,
      price: +wcProduct.price,
      image: wcProduct.images[0].src,
      description: wcProduct.description,
      stock: wcProduct.stock_quantity ? wcProduct.stock_quantity : 0,
    };
  });

  const storedProductIds: number[] = [];
  const failedProductSkus: string[] = [];
  for (let i = 0; i < storePayloads.length; i++) {
    const storePayload = storePayloads[i];
    try {
      const result = await storeProduct(storePayload);

      storedProductIds.push(Number(result.id));
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.log(errorMessage);
      failedProductSkus.push(errorMessage);
    }
  }

  if (!storedProductIds.length) {
    throw new BadRequestError('import products failed', failedProductSkus);
  }

  const storedProducts = await getProductsByIdsFromDb(storedProductIds);

  if (failedProductSkus.length) {
    return {
      isSuccess: false,
      data: storedProducts,
      errors: failedProductSkus,
    };
  }

  return {
    isSuccess: true,
    data: storedProducts,
  };
};

const extractQueryParamsFromPayload = (
  payload: TImportProductFromWc
): TProductWcQueryParam => {
  if (payload.sku?.length) {
    return {
      sku: payload.sku.join(','),
      per_page: payload.count ? payload.count : undefined,
    };
  }

  if (payload.stockStatus) {
    return {
      stock_status: payload.stockStatus,
      per_page: payload.count ? payload.count : undefined,
    };
  }

  return {
    per_page: payload.count,
  };
};
