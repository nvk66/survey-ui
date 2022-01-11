import instance from "./api.service";
import {generatePath} from "react-router";
import CategoryData from "../types/categoryData";

const categoryPath = (surveyId: any) => {
    return generatePath('categories/survey/:surveyId/', {
        surveyId: surveyId,
    })
}

const get = (surveyId: any) => {
    return instance.get<CategoryData[]>(categoryPath(surveyId));
}

const add = (category: CategoryData, surveyId: any) => {
    return instance.post<CategoryData>(categoryPath(surveyId), category);
}

const getById = (categoryId: any) => {
    return instance.get<CategoryData>(generatePath('categories/:categoryId/', {
        categoryId: categoryId,
    }));
}

const CategoryService = {
    get,
    add,
    getById
};

export default CategoryService;
