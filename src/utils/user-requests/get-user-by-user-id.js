import axios from "axios";

const museumApi = axios.create({
    baseURL: "https://museum-project-back-end.onrender.com/api"
})

export const getUserByUserId = (user_id) => {
    return museumApi
    .get(`/users/${user_id}`)
    .then((res) => {
        return res.data;
    })
};
