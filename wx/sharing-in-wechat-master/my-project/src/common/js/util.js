function formattime(num){
    if(num<10){
        num='0'+num
    }
    return num;
}
export default {
    formattime:formattime
}