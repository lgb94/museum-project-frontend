import axios from "axios";

const museumApi = axios.create({
    baseURL: "https://museum-project-back-end.onrender.com/api"
})

export const getExhibitsByUserId = (user_id) => {
    return museumApi
    .get(`/exhibits/user/${user_id}`)
    .then((res) => {
        return res.data;
    })
};
