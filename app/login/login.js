let CONTAINERS = {
    LOG_IN:'login-container',
    SIGN_UP:'sign-up-container',
    POINT:'.',
    LOGIN_TAB:'log-in-t',
    SIGN_UP_TAB:'sign-up-t',
    LOGIN_TYPES:{
        LOGIN:'LOGIN',
        SIGNUP:'SIGNUP'
    }
};

$(document).ready(function(){
    let ele = $(CONTAINERS.POINT + CONTAINERS.SIGN_UP);
    ele && ele.length && ele.hide();
    $('.l-type').val(CONTAINERS.LOGIN_TYPES.LOGIN);
    $(CONTAINERS.POINT + CONTAINERS.LOGIN_TAB).addClass('bg-white font-wight-600');
    $('.signup-form-container').find('.sign-up-form').find('input#dob').datepicker({format:'mm/dd/yyyy',container:".date",autoclose:true});
});

function showSignUpForm(ele){
   let source= CONTAINERS.POINT + CONTAINERS.LOG_IN;
   let dest = CONTAINERS.POINT + CONTAINERS.SIGN_UP;
   let parentEle= $(ele).parents(source);
   if(parentEle){
    $(parentEle).hide();
    let targetEle= $(parentEle).next(dest);
    targetEle && targetEle.length && $(targetEle).show();
    let lvalue = $('.l-type').val();
    
    if( lvalue == CONTAINERS.LOGIN_TYPES.LOGIN){
        $('.l-type').val(CONTAINERS.LOGIN_TYPES.SIGNUP);
        $(CONTAINERS.POINT +  CONTAINERS.LOGIN_TAB).removeClass('bg-white font-wight-600');
        $(CONTAINERS.POINT +  CONTAINERS.SIGN_UP_TAB).addClass('bg-white font-wight-600');
        $('.signup-form-container').find('.sign-up-form').find('input#dob').datepicker({format:'mm/dd/yyyy',container:".date",autoclose:true});
    }
   }
};

function showSignUp(){
    let source= CONTAINERS.POINT + CONTAINERS.LOG_IN;
    $(source).hide();
    let dest = CONTAINERS.POINT + CONTAINERS.SIGN_UP;
    let targetEle= $(dest);
    targetEle && targetEle.length && $(targetEle).show();
    let lvalue = $('.l-type').val();
    
    if( lvalue == CONTAINERS.LOGIN_TYPES.LOGIN){
        $('.l-type').val(CONTAINERS.LOGIN_TYPES.SIGNUP);
        $(CONTAINERS.POINT +  CONTAINERS.LOGIN_TAB).removeClass('bg-white font-wight-600');
        $(CONTAINERS.POINT +  CONTAINERS.SIGN_UP_TAB).addClass('bg-white font-wight-600');
        $('.signup-form-container').find('.sign-up-form').find('input#dob').datepicker({format:'mm/dd/yyyy',container:".date",autoclose:true});
    }
    
}

function showLogin(){
    let source= CONTAINERS.POINT + CONTAINERS.SIGN_UP;
    $(source).hide();
    let dest = CONTAINERS.POINT + CONTAINERS.LOG_IN;
    let targetEle= $(dest);
    targetEle && targetEle.length && $(targetEle).show();
    let lvalue = $('.l-type').val();
    
    if( lvalue == CONTAINERS.LOGIN_TYPES.SIGNUP){
        $('.l-type').val(CONTAINERS.LOGIN_TYPES.LOGIN);
        $(CONTAINERS.POINT +  CONTAINERS.SIGN_UP_TAB).removeClass('bg-white font-wight-600');
        $(CONTAINERS.POINT +  CONTAINERS.LOGIN_TAB).addClass('bg-white font-wight-600');
    }
}

loginSubmit = (e)=>{
    let formData = utils.formToObject(e);
    let flag = staffValidate.isValidateForm(e);
    if(!flag){
        let URI = "./loginValidate.php";
    serviceAPI.httpPOST(URI,formData,postCallBack,error);
    }
}

function postCallBack(resp,status){
    let flag = resp.success;
    if(flag){
        window.location="../main/menu.php"
    }else{
        if(resp.errors){
            $('.user-id').next().html(resp.errors.userid);
            $('.password').next().html(resp.errors.password);
        }
    }
}

function error(error){
    console.log(error);
}