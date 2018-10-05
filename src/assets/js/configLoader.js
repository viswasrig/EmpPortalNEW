(function(){
    window.appConfig = _appConfig();
    function _appConfig(){
        return {
            init: () => { },
            loadModules: () => {
                setTimeout(()=>{
                    $(document).ready(function(){
                       // $('body').bootstrapMaterialDesign();
                        $('[data-toggle="tooltip"]').tooltip();
                    });
                },1000);
            }
        }
    }
})();