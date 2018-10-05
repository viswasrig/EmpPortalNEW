(function(staffValidate){
    'use strict';

    window.staffValidate = staffValidate || _staffValidate();
    
    $(document).ready(function(){
        /* let forms = $('.form');
        forms && forms.each((idx,form)=>{
            $(form).on("customSubmit",(e)=>{
                console.log(e)
                e.preventDefault();
                e.stopPropagation();
            });
            isValidForm(form,'INIT');
            $(form).submit(function(e){
                let isValid = isValidForm(form,'TOUCHED');
            e.preventDefault();
            e.stopPropagation();
            
            });
        });

        $('.form-control').bind('keyup',function(e){
            let error = {msg:'',errorCode:-1,type:'TOUCHED'};
            isValidField(this,error);
            addError(this,error);
        });

        $('.form-control').bind('blur',function(e){
            let error = {msg:'',errorCode:-1,type:'TOUCHED'};
            isValidField(this,error);
            addError(this,error);
        });

        $('select.form-control').on('change',function(e){
            let error = {msg:'',errorCode:-1,type:'TOUCHED'};
            isValidField(this,error);
            addError(this,error);
        });
 */
        _onLoadForms();

    });

    function customValidateForm(form){
        return isValidForm(form,"TOUCHED");
    }

    function isValidForm(form, type){
        let formElements = $(form).find('.form-control');
        let formValidate = {valid:true,inValid:false,formTouched:false,errors:null}
        validateFormElements(formElements,formValidate,type);
       return formValidate.valid;
    }

    function validateRequiredField(field,error){
        if($(field).is('[requied]') || $(field).attr('required')){
            isEmpty(field,error);
            if(error.errorCode==0){
                return error;
            }
            
        }
        validateNonRequiredField(field,error);
    }

    function validateNonRequiredField(field,error){
        if(!$(field).is('[requied]') || !$(field).attr('required')){
            validateField(field,error);
        }
    }

      function validateFormElements(formElements,formValidate,type){
          for(let i=0;i<formElements.length;i++ ){
              let error = {msg:'', errorCode:-1,type:type};
              let field = formElements[i];
              isValidField(field,error);
              formValidate.valid = formValidate.valid && !(error.errorCode === 0);
          }
      } 

      function isValidField(field,error){
        if(!$(field).is(':disabled') || !$(field).is('[readonly]')){
            addError(field,error);
            validateRequiredField(field,error);
          }
      }

      function validateField(field,error){
        isValidPattern(field,error);
        if(error.errorCode ==0){
            return error;
        }
        isValidMaxLength(field,error);
        if(error.errorCode ==0){
            return error;
        }
        isValidMinLength(field,error);
        if(error.errorCode ==0){
            return error;
        }
      }



      function getValue (field){
        let nodeName = $(field).prop("tagName");
        let value = $(field).val();
        if(nodeName === 'INPUT'){
            value = $(field).val();
        }else if(nodeName === 'SELECT'){ 
            value = $(field).children('option:selected').val();
            if(value==-1){
                value = '';
            }
        }else{
            value = value; 
        }
        return value;
      }

      function isEmpty(field,error){
        let value = getValue(field);
        let flag = utils.isEmpty(value);
          if(flag){
            error.errorCode = 0;
            error.msg = utils.capitalizeFirstLetter($(field).attr('data-efield'))+' is requied';
          }
          addError(field,error);
          return error;
      }


      function isValidPattern(field,error){
          let value = getValue(field);
          let pattern = $(field).attr('pattern');
          if(!utils.isEmpty(pattern)){
            let flag  = new RegExp(pattern).test(value);
            if(flag){
                error.errorCode = 1;
                error.msg = '';
            }else{
                error.errorCode = 0;
                error.msg = 'Pattern not matched';
            }
          }
          addError(field,error);
          return error;
      }

      function addError(field,error){
          let errorEle = $('<div></div>').addClass('error');;
          let destination = $(field).next();
          let msg = error.errorCode === 1 || error.type==='INIT' ?'':error.msg;
          let flag = $(destination) && $(destination).length && $(destination).hasClass('error');
          errorEle = flag?destination:errorEle;
          $(errorEle).html(msg);
          if(!flag){
              // console.log($(field));
              $(field).after($(errorEle));
          }
      }

      function isValidMaxLength(field,error){

      }

      function isValidMinLength(field,error){

      }

      function _onLoadForms () {
        $(document).ready(function(){
            let forms = $('.form');
            forms && forms.each((idx,form)=>{
                $(form).on("customSubmit",(e)=>{
                    console.log(e)
                    e.preventDefault();
                    e.stopPropagation();
                });
                isValidForm(form,'INIT');
                /* $(form).submit(function(e){
                    let isValid = isValidForm(form,'TOUCHED');
                e.preventDefault();
                e.stopPropagation();
                }); */
            });

            $('.form-control').bind('keyup',function(e){
                let error = {msg:'',errorCode:-1,type:'TOUCHED'};
                isValidField(this,error);
                addError(this,error);
            });

            $('.form-control').bind('blur',function(e){
                let error = {msg:'',errorCode:-1,type:'TOUCHED'};
                isValidField(this,error);
                addError(this,error);
            });

            $('select.form-control').on('change',function(e){
                let error = {msg:'',errorCode:-1,type:'TOUCHED'};
                isValidField(this,error);
                addError(this,error);
            });
        });  
        

      }


      function _staffValidate(){
          return{
              onLoad: _onLoadForms,
              isValidateForm:customValidateForm
          }
      }
    
})(window.staffValidate);