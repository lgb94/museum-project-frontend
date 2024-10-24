import axios from "axios";

const museumApi = axios.create({
    baseURL: "https://museum-project-back-end.onrender.com/api"
})

export const getAllExhibits = () => {
    return museumApi
    .get(`/exhibits`)
    .then((res) => {
        return res.data;
    })
};
