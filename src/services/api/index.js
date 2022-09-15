import { fetchCall } from "../endpoints";
import config from '../../constants/config.json';

const getData = ()=> 
    fetchCall(
        "http://fetest.pangeatech.net/data",
        config.requestMethod.GET,
        {}
    );

export {
    getData
}