import fetch from './fetch'

/**
 * 登陆
 */

export const login = data => fetch('/Account/Login', data, 'POST');
/**
 * 退出
 */
export const logout = data => fetch('/Account/Logout', data, 'POST');

export const editUserPwd = data => fetch('/Sys_Users/EditPwd_Web_User', data, 'POST');

/**
 * 获取所有一级菜单
 */
export const functionTreeGrid = data => fetch('/Sys_Function/GetList', data, 'POST');
/**
 * 获取所有一级菜单
 */
export const parentFunctionList = data => fetch('/Sys_Function/GetParentFunction', data, 'POST');
/**
 *  * 获取余额
 */
export const GetCustomer = data => fetch('/Cus_Customer/Get_Cus_Customer', data, 'POST');
/**

 * 添加菜单
 */
export const addFunction = data => fetch('/Sys_Function/Add_Sys_Function', data, 'POST');
/**
 * 修改菜单
 */
export const editFunction = data => fetch('/Sys_Function/Edit_Sys_Function', data, 'POST');
/**
 * 修改菜单
 */
export const delFunction = data => fetch('/Sys_Function/Delete_Sys_Function', data, 'POST');
/**
 * 获取按钮权限list
 */
export const actionList = data => fetch('/Sys_Function/GetRbacAction', data, 'POST');
/**
 * 添加按钮
 */
export const addAction = data => fetch('/Sys_Function/Add_Rbac_Action', data, 'POST');
/**
 * 修改按钮
 */
export const editAction = data => fetch('/Rbac_Function/Update_Rbac_Action', data, 'POST');
/**
 * 获取按钮权限list
 */
export const rolePagedList = data => fetch('/Sys_Role/List_Sys_Role', data, 'POST');
/**
 * 添加角色
 */
export const addRole = data => fetch('/Sys_Role/Add_Sys_Role', data, 'POST');
/**
 * 修改角色
 */
export const editRole = data => fetch('/Sys_Role/Edit_Sys_Role', data, 'POST');
/**
 * 删除角色
 */
export const delRole = data => fetch('/Sys_Role/Delete_Sys_Role', data, 'POST');
/**
 * 获取权限树
 */
export const roleTree = data => fetch('/Sys_Role/RoleTree', data, 'POST');
/**
 * 设置权限树
 */
export const setRoleTree = data => fetch('/Sys_Role/SetRoleTree', data, 'POST');
/**
 * 角色普通下拉框
 */
export const roleComboList = data => fetch('/Sys_Role/GetComboList', data, 'POST');
/**
 * 获取操作日志list
 */
export const operationLogPagedList = data => fetch('/OperationLog/List_OperationLog', data, 'POST');
/**
 * 省combo
 */
export const provinceCombo = data => fetch('/Department/GetProvinces', data, 'POST');
/**
 * 市combo
 */
export const cityCombo = data => fetch('/Department/GetCities', data, 'POST');
/**
 * 区combo
 */
export const districtCombo = data => fetch('/Department/GetDistrict', data, 'POST');
/**
 * 部门combo
 */
export const deptTreeCombo = data => fetch('/Department/GetComboTree', data, 'POST');
/**
 * 获取用户list
 */
export const userPagedList = data => fetch('/Sys_Users/List_Sys_Users', data, 'POST');
/**
 * 添加用户
 */
export const addUser = data => fetch('/Sys_Users/Add_Sys_Users', data, 'POST');
/**
 * 修改用户
 */
export const editUser = data => fetch('/Sys_Users/Edit_Sys_Users', data, 'POST');
/**
 * 删除用户
 */
export const delUser = data => fetch('/Sys_Users/Delete_Sys_Users', data, 'POST');
/**
 * 用户密码重置
 */
export const resetUserPwd = data => fetch('/Sys_Users/ResetPwd_Web_User', data, 'POST');

// region 教练车
export const getExamCarList = data => fetch('/Exam_Car/List_Exam_Car', data, 'POST');
export const addExamCar = data => fetch('/Exam_Car/Add_Exam_Car', data, 'POST');
export const editExamCar = data => fetch('/Exam_Car/Edit_Exam_Car', data, 'POST');
export const deleteExamCar = data => fetch('/Exam_Car/Delete_Exam_Car', data, 'POST');
//   endregion

// region 教练员
export const getExamCoachList = data => fetch('/Exam_Coach/List_Exam_Coach', data, 'POST');
export const addExamCoach = data => fetch('/Exam_Coach/Add_Exam_Coach', data, 'POST');
export const editExamCoach = data => fetch('/Exam_Coach/Edit_Exam_Coach', data, 'POST');
export const deleteExamCoach = data => fetch('/Exam_Coach/Delete_Exam_Coach', data, 'POST');
//   endregion

// region优惠卷
export const getExamRateCodeList = data => fetch('/Exam_RateCode/List_Exam_RateCode', data, 'POST');
export const addExamRateCode = data => fetch('/Exam_RateCode/Add_Exam_RateCode', data, 'POST');
export const editExamRateCode = data => fetch('/Exam_RateCode/Edit_Exam_RateCode', data, 'POST');
export const delExamRateCode = data => fetch('/Exam_RateCode/Delete_Exam_RateCode', data, 'POST');
// endregion

// region资费
export const getExamExpenseList = data => fetch('/Exam_Expense/List_Exam_Expense', data, 'POST');
export const addExamExpense = data => fetch('/Exam_Expense/Add_Exam_Expense', data, 'POST');
export const editExamExpense = data => fetch('/Exam_Expense/Edit_Exam_Expense', data, 'POST');
export const delExamExpense = data => fetch('/Exam_Expense/Delete_Exam_Expense', data, 'POST');
// endregion


// region订单
export const getValidCarCombo = data => fetch('/Exam_Car/Get_Valid_CarCombo', data, 'POST');
export const getExamExpense = data => fetch('/Exam_Expense/Get_Exam_Expense', data, 'POST');
export const validateCoachMobile = data => fetch('/Exam_Coach/Validate_Exam_Coach', data, 'POST');
export const getRateCode = data => fetch('/Exam_RateCode/Get_Exam_RateCode', data, 'POST');
export const getExamOrderList = data => fetch('/Exam_Orders/List_Exam_Orders', data, 'POST')
export const addExamOrder = data => fetch('/Exam_Orders/Add_Exam_Orders', data, 'POST')
export const getSalesStatic = data => fetch('/Exam_Orders/GetSalesStatic', data, 'POST')
export const getCoachRebate = data => fetch('/Exam_Orders/GetCoachRebate', data, 'POST')
export const getCoachRebateExcel = data => fetch('/Exam_Orders/GetCoachRebateExcel', data, 'POST')
export const getSalesStaticExcel = data => fetch('/Exam_Orders/GetSalesStaticExcel', data, 'POST')

// endregion



