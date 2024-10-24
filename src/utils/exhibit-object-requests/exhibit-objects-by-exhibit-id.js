import axios from "axios";

const museumApi = axios.create({
    baseURL: "https://museum-project-back-end.onrender.com/api"
})

export const getExhibitsObjectsByExhibitId = (exhibit_id) => {
    return museumApi
    .get(`/exhibitobjects/${exhibit_id}`)
    .then((res) => {
        return res.data;
    })
};
