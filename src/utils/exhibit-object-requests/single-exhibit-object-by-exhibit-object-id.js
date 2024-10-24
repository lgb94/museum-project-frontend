import axios from "axios";

const museumApi = axios.create({
    baseURL: "https://museum-project-back-end.onrender.com/api"
})

export const getExhibitsObjectByExhibitObjectId = (exhibit_object_id) => {
    return museumApi
    .get(`/exhibitobjects/objects/${exhibit_object_id}`)
    .then((res) => {
        return res.data;
    })
};
