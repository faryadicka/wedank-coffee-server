import { onFailed, onSuccess } from "../helpers/response"
const { updateProductModel: updateModel, createProductsModel: createModel, insertImagesModel: imagesModel, getAllProductsModel: getAllModel } = require('../models/products')
const { generateOTP } = require('../helpers/otpGenerator')

const getAllProductsController = async (req: any, res: any) => {
  try {
    const { page, limit, order, sort, name, type, min, max } = req.query
    const response = await getAllModel(page, limit, order, sort, name, type, Number(min), Number(max))
    const result = response.rows.map((item: any) => {
      const imgValues = Object.values(item).filter((i: any) => {
        return String(i).includes('image')
      })
      return { id: item.id, name: item.name, price: item.price, size: item.size, type_id: item.type_id, created_at: item.created_at, description: item.description, image: imgValues }
    })
    onSuccess(res, 200, 'Get all products successfully', result)
  } catch (error: any) {
    onFailed(res, 500, 'Internal Server Error', error.message)
  }
}

const createProductsController = async (req: any, res: any) => {
  try {
    const images_id = generateOTP()
    const { name, price, size, type_id, description } = req.body
    const { files } = req
    await createModel(name, Number(price), size.toUpperCase(), Number(type_id), description, images_id)
    await imagesModel(images_id, files[0].path, files[1].path, files[2].path, files[3].path)
    onSuccess(res, 200, 'Create product successfully')
  } catch (error: any) {
    onFailed(res, 500, 'Internal Server Error', error.message)
  }
}

const updateProductController = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const { name, price, size, type, description } = req.body
    console.log(id)
    const response = await updateModel(name, price, size, type, description, id)
    onSuccess(res, 200, 'Update Product successfully', response.rows)
  } catch (error: any) {
    onFailed(res, 500, 'Internal Server Error', error.message)
  }
}

module.exports = { createProductsController, getAllProductsController, updateProductController }