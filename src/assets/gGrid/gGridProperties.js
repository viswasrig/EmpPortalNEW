let gGridProps = (function(gGridProps){
  // import {GRID_CONSTANTS} from './gGridConstants';
  
    let gGridProps_ = {
      getColumnProperties:_getColumnProperties,
      getTableProperties:_tableProperties
  
  };
    return gGridProps_;



    function _tableProperties(){
        return {
          gridId: '',
          gridClassName: '',
          container:'g-grid',
          columns: [],
          sortable: false,
          filterable: false,
          rowSelectable: false,
          rowSortIcon: '',
          multiSelectEnable: false,
          inlineEdit: false,
          onSelectRow: null,
          dataSource: getDataSource() ||null
          }
      }


    function _getColumnProperties(){
        return{
            index:0,
            id:'',
            title:'',
            field:'',
            classNames:'',
            styles:'',
            enableFilter:false,
            enableSorting:false,
            sort: {orderBy: 'ASC', ASC: 'fa fa-arrow-up', DESC: 'fa fa-arrow-down', sortAction:null},
            filter:getFilterProperties(),
            selected:false,
            groupable:false,
            customTemplateFun:'',
            dataType:'',
            template:null,
            width:'',
            height:'',
            onRowSelcet: null,
             
        }
    }

    function getDataSource(){
      return { 
        data:[],
        viewData:[],
        schema:{
          fields:{}
        }
      }
    }

    function getFilterProperties(){
       return {
          cIndex:0,
          type:gGrid.GRID_CONSTANTS.FILTER_TYPES.BASIC,
          title:'',
          input:true,
          model:false,
          placeHolder:'',
          click:null,
          onChange: null,
          classNames:'',
          styleNames:'',
          icon:{position:'left',iconclass:'', showIcon:false, showtxt:false, icontext:''},
          operations:[{key:'=',txt:'Is Equla To'},{key:'!=',txt:'Is Not Equla To'}],
          popup:{
            title:'',
            selectedHeader:'',
            header:{
              idx:0,
              cIndex:0,
              subheaders:[{
                title:'',
                type:'',
                icon:true,
                iconClass:'',
                containerClassName:''
              },{
                title:'',
                icon:true,
                iconClass:'',
                containerClassName:''
              },{
                title:'',
                icon:true,
                iconClass:'',
                containerClassName:''
              }]
            }
          }
        }
      }
})(null)  
window.gGrid = window.gGrid ||{};
window.gGrid['gGridProps'] = gGridProps;  
  
  