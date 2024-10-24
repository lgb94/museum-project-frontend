import axios from "axios";

const museumApi = axios.create({
    baseURL: "https://museum-project-back-end.onrender.com/api"
})

export const deleteExhibitWithExhibitId = (exhibit_id) => {
    return museumApi
    .delete(`/exhibits/${exhibit_id}`)
    .then((res) => {
        return res.data;
    })
};
