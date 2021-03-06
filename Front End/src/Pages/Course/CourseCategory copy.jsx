import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {connect} from "react-redux";
import {getCategoryDataAction} from "./../../Store/actionCreators";
import { Input ,Pagination,message, Modal,} from 'antd';
import {withRouter } from 'react-router';
import { CheckOutlined } from '@ant-design/icons';
import {addCategoryData, delCategoryData} from '../../Api/'
const { Search } = Input;
const { confirm } = Modal;
class CourseCategory extends Component {
    state = { 
        pageSize:2,
         search:'',
         current:1
        };

    goSearch(){
        const pageSize=this.state.pageSize
        const key=this.state.search
        let currentPage=this.state.current
        const params={
            key:key,
            pageSize:pageSize,
            currentPage:currentPage
        }
        this.props.reqCategoryData(params);
    }
    searchChange(e){
        this.setState({search: e.target.value})
        console.log(e.target.value);
    }
    goAddCategory(){
        this.props.history.push('/course/category_add');
    }
    goEditMain(id,mainTitle,sort,isShow){
        console.log(mainTitle);
        // console.log(id);
        const key={id:id,mainTitle:mainTitle, subTitle:''}
        // window.sessionStorage.setItem("goEditMain", key);
        this.props.history.push({
            pathname: '/course/category_add',
            state: { key }
          });
        // const params={
        //     mainTitle:mainTitle,
        //     subIndex:'',
        //     sort:sort,
        //     isShow:isShow
        // }
        // addCategoryData(params).then((res)=>{
        //     console.log(res);
        // }).catch((err)=>{console.log(err);})
    }
    goEditSub(id,mainTitle,index,sort,isShow){
        console.log(mainTitle,index);
        const params={
            mainTitle:mainTitle,
            subIndex:index,
            sort:sort,
            isShow:isShow
        }
        addCategoryData(params).then((res)=>{
            console.log(res);
        }).catch((err)=>{console.log(err);})
    }
    goDelMain(id,mainTitle,sort,isShow){
        const that=this
        confirm({
          title: 'Delete Confirm?',
          icon: <CheckOutlined  />,
          content: 'Are you sure to delete this main category?',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            console.log(mainTitle);
            const params={
                id:id,
                mainTitle:mainTitle,
                subIndex:-100,
                sort:sort,
                isShow:isShow
            }
            delCategoryData(params).then((res)=>{
                if(res.status_code === 200){
                    message.success('Deleted Successfully', 1)
                }

            }).catch((err)=>{console.log(err);})

          },
          onCancel() {
            // console.log('Cancel');
          },
        });
      }

    goDelSub(id,subTitle,mainTitle,index,sort,isShow){
        confirm({
            title: 'Delete Confirm?',
            icon: <CheckOutlined  />,
            content: 'Are you sure to delete this main category?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                // console.log(mainTitle,index);
                const params={
                    id:id,
                    subTitle:subTitle,
                    mainTitle:mainTitle,
                    subIndex:index,
                    sort:sort,
                    isShow:isShow
                }
                delCategoryData(params).then((res)=>{
                    console.log(res);
                }).catch((err)=>{console.log(err);})
            },
            onCancel() {
              // console.log('Cancel');
            },
          });
       
    }
    render() {
        const {categoryData} = this.props;
        return (
            <div className="container-fluid">
                <div className="body course-category">
                    <ol className="breadcrumb">
                        <li><Link to="/course/link">Courses / </Link></li>
                        <li className="active">Category</li>
                    </ol>
                    <div>
                    <Search
                    style={{width:'50%',marginLeft:'25%',marginBottom:'30px'}} 
                    onSearch={this.goSearch.bind(this)} 
                    placeholder="input search text" 
                    onChange={this.searchChange.bind(this)} 
                        enterButton="Search"
                        size="large"
                    />
                    </div>
                    <div className="page-title">
                        <Link to="#" onClick={this.goAddCategory.bind(this)} className="btn btn-danger btn-sm pull-right">Add Category</Link>
                    </div>
                    <div className="panel panel-default">
                        <table className="table table-bordered">
                            <thead>
                            <tr style={{backgroundColor:'rgb(95, 139, 181)'}}>
                                <th width="30%">Classification</th>
                                <th>Courses Number</th>
                                <th>Status</th>
                                <th>Sort</th>
                                <th width="10%">Action</th>
                            </tr>
                            </thead>
                              {categoryData[0].map((category, index1)=>{
                                  return (
                                      <tbody  key={index1}>
                                          <tr 
                                          style={{borderLeft:'none',borderRight:'none',backgroundColor:'rgb(21, 107, 109)'}} 
                                          className="active">
                                              <td className="text-left">{category.main_title}</td>
                                              <td style={{fontSize:'25px',fontStyle:'italic'}}><strong>{category.main_total_count}</strong></td>
                                              <td style={{fontSize:'20px'}}>{category.main_is_show === '1' ? 'Show' : 'Hide'}</td>
                                              <td>{category.main_sort}</td>
                                              <td>
                                                  <Link 
                                                to={{
                                                pathname: '/course/category_add',
                                                state: {id:category._id, subTitle:-2 },
                                                }}
                                                //   onClick={this.goEditMain.bind(this, category._id,category.main_title,category.main_sort,category.main_is_show)}
                                                   className="btn btn-info btn-xs">Edit</Link>
                                                  <Link 
                                                // to={{
                                                // pathname: '/course/category_add',
                                                // state: {id:category._id, subTitle: },
                                                // }}
                                                to="#"
                                                  onClick={this.goDelMain.bind(this,category._id,category.main_title,category.main_sort,category.main_is_show)} 
                                                  style={{width:'65px'}}
                                                  className="btn btn-danger btn-xs">Del</Link>
                                              </td>
                                          </tr>
                                          {
                                              category.sub_course.map((sub, index2)=>{
                                                  return (
                                                      <tr 
                                                      style={{borderLeft:'none',borderRight:'none',}}
                                                      key={index2}>
                                                          <td  className="text-left">&nbsp;&nbsp;&nbsp;├ {sub.sub_title}</td>
                                                          <td>{sub.sub_total_count}</td>
                                                          <td>{sub.sub_is_show === '1' ? 'Show' : 'Hide'}</td>
                                                          <td>{category.sub_sort}</td>
                                                          <td>
                                                              <Link 
                                                            //   to="#"  
                                                            to={{
                                                pathname: '/course/category_add',
                                                state: {id:category._id, subTitle:index2 },
                                                }}
                                                              onClick={this.goEditSub.bind(this,category._id,category.main_title,index2,category.main_sort,category.main_is_show)} 
                                                              className="btn btn-info btn-xs">Edit</Link>
                                                              <Link to="#"  onClick={this.goDelSub.bind(this,category._id,sub.sub_title,category.main_title,index2,category.main_sort,category.main_is_show)} 
                                                              style={{width:'65px'}}
                                                              className="btn btn-danger btn-xs">Del</Link>
                                                          </td>
                                                      </tr>
                                                  )
                                              })
                                          }
                                      </tbody>
                                  )
                              })}
                        </table>
                    </div>
                    <Pagination
                    style={{width:'60%',marginLeft:'30%'}} 
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={total => `Total ${total} Category`}
                    current={this.state.current} 
                    total={categoryData[1]} 
                    pageSize={this.state.pageSize}
                    onChange={this.pageChange.bind(this)}
                      />
                </div>
            </div>
        );
    }

    componentDidMount() {
        const pageSize=this.state.pageSize
        const key=this.state.search
        let currentPage=this.state.current
        const params={
            key:key,
            currentPage: currentPage,
            pageSize:pageSize
        }
       this.props.reqCategoryData(params);
    }
    pageChange(page){
        console.log(page);
        const pageSize=this.state.pageSize
        const key=this.state.search
        let currentPage=page
        this.setState({
            current:page
        })
        const params={
            key:key,
            currentPage: currentPage,
            pageSize:pageSize
        }
       this.props.reqCategoryData(params);
    }






}

const mapStateToProps = (state)=>{
    return {
        categoryData: state.categoryData
    }
};

const mapDispatchToProps = (dispatch)=>{
    return {
        reqCategoryData(params){
            const action = getCategoryDataAction(params);
            dispatch(action)
        }
    }
};

export default  withRouter(connect(mapStateToProps, mapDispatchToProps)(CourseCategory));