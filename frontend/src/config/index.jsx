import axios  from "axios";
export const BASE_URL ="https://lindenclone.onrender.com"
export const clientServer=axios.create({
    baseURL:BASE_URL
});
