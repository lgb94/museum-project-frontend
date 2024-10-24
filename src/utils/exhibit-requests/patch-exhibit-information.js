import axios from "axios";

const museumApi = axios.create({
    baseURL: "https://museum-project-back-end.onrender.com/api"
})

export const patchExhibitTitleAndDescription = (exhibit_id, updateInformation) => {
    return museumApi
    .patch(`/exhibits/${exhibit_id}`, updateInformation)
    .then((res) => {
        return res.data;
    })
};
