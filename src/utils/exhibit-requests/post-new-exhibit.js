import axios from "axios";

const museumApi = axios.create({
    baseURL: "https://museum-project-back-end.onrender.com/api"
})

export const postNewExhibit = (newExhibit) => {
    return museumApi
    .post(`/exhibits`, newExhibit)
    .then((res) => {
        return res.data;
    })
};
