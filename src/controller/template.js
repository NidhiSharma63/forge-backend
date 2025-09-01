import Template from "../models/templateSchema.js";
const createTemplate = async (req, res, next) => {
  try {
    const { userId, data, isTemplate } = req.body;
    if (!userId) throw new Error("userId is missing");
    if (!data) throw new Error("data is missing");
    const template = new Template({
      userId,
      templateData: data,
      isTemplate: isTemplate || false,
    });
    await template.save();
    res.status(200).json(template);
  } catch (error) {
    next(error);
  }
};

const updateTemplate = async (req, res, next) => {
  try {
    const { templateId, data, userId } = req.body;
    if (!userId) throw new Error("userId is missing");
    const template = await Template.findOne({ _id: templateId });
    if (!template) throw new Error("Template not found");
    template.templateData = data;
    await template.save();
    res.status(200).json(template);
  } catch (error) {
    next(error);
  }
};

const deleteTemplate = async (req, res, next) => {
  try {
    const { templateId, userId } = req.body;
    if (!userId) throw new Error("userId is missing");
    const template = await Template.findOne({ _id: templateId });
    if (!template) throw new Error("Template not found");
    await template.remove();
    res.status(200).json(template);
  } catch (error) {
    next(error);
  }
};

const getAllUserTemplate = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) throw new Error("userId is missing");
    const template = await Template.find({ userId });
    res.status(200).json(template);
  } catch (error) {
    next(error);
  }
};

const getSingleTemplate = async (req, res, next) => {
  try {
    const { templateId, userId } = req.query;
    if (!userId) throw new Error("userId is missing");
    const template = await Template.findOne({ _id: templateId });
    res.status(200).json(template);
  } catch (error) {
    next(error);
  }
};
export {
  createTemplate,
  deleteTemplate,
  getAllUserTemplate,
  getSingleTemplate,
  updateTemplate,
};
