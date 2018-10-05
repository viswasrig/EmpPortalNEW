(function(api){
    window.serviceAPI = api || ServiceAPI_();
    function ServiceAPI_(){
        let vm =this;

        _httpPOST = (URI, postData, successCallback,errorCallBack) =>{
            $.post(URI,postData,function(response,status){
                if(successCallback){
                    successCallback(response);
                }
            },"json");
            
        }

        _httpGET = (URI, postData, successcallback,errorCallBack)=>{
            return $.ajax({
                url : URI,
                method : 'POST',
                dataType : "json",
                data:postData,
                success:successcallback,
                error:errorCallBack
               });
        }

        return{
            httpPOST:vm._httpPOST,
            httpGET :vm._httpGET
        }
    }
})(window.serviceAPI);