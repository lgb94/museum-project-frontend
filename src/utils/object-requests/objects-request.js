import axios from "axios";

const museumApi = axios.create({
    baseURL: "https://museum-project-back-end.onrender.com/api"
})

export const objectsRequest = (queryObject) => {
    return museumApi
    .get(`/objects`, {
        params : queryObject
})
    .then((res) => {
        return res.data;
    })
};
