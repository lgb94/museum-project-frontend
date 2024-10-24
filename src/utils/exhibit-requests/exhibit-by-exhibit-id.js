import axios from "axios";

const museumApi = axios.create({
    baseURL: "https://museum-project-back-end.onrender.com/api"
})

export const getSingleExhibitbyExhibitId = (exhibit_id) => {
    return museumApi
    .get(`/exhibits/${exhibit_id}`)
    .then((res) => {
        return res.data;
    })
};
