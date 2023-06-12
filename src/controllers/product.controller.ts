import { Request, ResponseToolkit } from '@hapi/hapi';
import {
  deleteProduct,
  getAllProducts,
  getProductDetailById,
  importProductsFromWooCommerce,
  storeProduct,
  updateProduct,
} from '../services/product.service';
import { constructPaginationQuery, constructResponse } from '../utils';
import { TOrderBy } from '../types/common/order-by.type';
import { errorHandler } from '../utils/error.util';
import { EStatusCode } from '../enum/status-code.enum';
import { TStoreProduct } from '../types/product/store-product.type';
import { TUpdateProduct } from '../types/product/update-product.type';
import { TImportProductFromWc } from '../types/product/import-product-from-wc.type';

export const getProducts = async (req: Request, h: ResponseToolkit) => {
  try {
    const { limit, page, orderByField, orderByMethod } = req.query;
    const paginationQuery = constructPaginationQuery(limit, page);
    const orderBy: TOrderBy = {
      orderByField,
      orderByMethod,
    };

    const products = await getAllProducts(paginationQuery, orderBy);
    const { statusCode, ...response } = constructResponse(true, true, products);

    return h.response(response).code(statusCode);
  } catch (error) {
    return errorHandler(error, h);
  }
};

export const getProductDetail = async (req: Request, h: ResponseToolkit) => {
  try {
    const { productId } = req.params;
    const product = await getProductDetailById(productId);
    const { statusCode, ...response } = constructResponse(true, true, product);

    return h.response(response).code(statusCode);
  } catch (error) {
    return errorHandler(error, h);
  }
};

export const storeNewProduct = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload = req.payload as Record<string, any>;
    const storeProductPayload: TStoreProduct = {
      name: payload.name,
      sku: payload.sku,
      price: payload.price,
      image: payload.image,
      description: payload.description,
      stock: payload.stock,
    };

    const storedProduct = await storeProduct(storeProductPayload);
    const { statusCode, ...response } = constructResponse(
      true,
      true,
      storedProduct
    );

    return h.response(response).code(EStatusCode.CREATED);
  } catch (error) {
    return errorHandler(error, h);
  }
};

export const updateExistingProduct = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const payload = req.payload as Record<string, any>;
    const { productId } = req.params;
    const updateProductPayload: TUpdateProduct = {
      productId,
      name: payload.name,
      sku: payload.sku,
      price: payload.price,
      image: payload.image,
      description: payload.description,
    };
    const updatedProduct = await updateProduct(updateProductPayload);
    const { statusCode, ...response } = constructResponse(
      true,
      true,
      updatedProduct
    );

    return h.response(response).code(EStatusCode.OK);
  } catch (error) {
    return errorHandler(error, h);
  }
};

export const deleteExistingProduct = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const { productId } = req.params;
    const result = await deleteProduct(productId);
    const { statusCode, ...response } = constructResponse(true, true, result);

    return h.response(response).code(EStatusCode.OK);
  } catch (error) {
    return errorHandler(error, h);
  }
};

export const importProducts = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload = req.payload as Record<string, any>;
    const importPayload: TImportProductFromWc = {
      sku: payload.sku,
      stockStatus: payload.stock_status,
      count: payload.count,
    };

    const importedProducts = await importProductsFromWooCommerce(importPayload);

    const { statusCode, ...response } = constructResponse(
      true,
      importedProducts.isSuccess,
      importedProducts.data,
      undefined,
      undefined,
      importedProducts.errors
    );

    return h.response(response).code(EStatusCode.CREATED);
  } catch (error) {
    return errorHandler(error, h);
  }
};
