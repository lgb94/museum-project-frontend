import axios from "axios";

const museumApi = axios.create({
    baseURL: "https://museum-project-back-end.onrender.com/api"
})

export const getObjectById = (object_id) => {
    return museumApi
    .get(`/objects/${object_id}`)
    .then((res) => {
        return res.data;
    })
};
