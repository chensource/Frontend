import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout';

/* login */
// const Login = _import('login/index');
// const authRedirect = _import('login/authredirect');

/* dashboard */
// const dashboard = _import('dashboard/index');

/* Introduction */
// const Introduction = _import('introduction/index');

/* components */
// const componentsIndex = _import('components/index');
// const Tinymce = _import('components/tinymce');
// const Markdown = _import('components/markdown');
// const JsonEditor = _import('components/jsoneditor');
// const DndList = _import('components/dndlist');
// const AvatarUpload = _import('components/avatarUpload');
// const Dropzone = _import('components/dropzone');
// const Sticky = _import('components/sticky');
// const SplitPane = _import('components/splitpane');
// const CountTo = _import('components/countTo');
// const Mixin = _import('components/mixin');
// const BackToTop = _import('components/backToTop')

/* charts */
// const chartIndex = _import('charts/index');
// const KeyboardChart = _import('charts/keyboard');
// const KeyboardChart2 = _import('charts/keyboard2');
// const LineMarker = _import('charts/line');
// const MixChart = _import('charts/mixChart');

/* error page */
// const Err404 = _import('error/404');
// const Err401 = _import('error/401');

/* error log */
// const ErrorLog = _import('errlog/index');

/* excel */
// const ExcelDownload = _import('excel/index');
// const SelectExcelDownload = _import('excel/selectExcel');

/* theme  */
// const Theme = _import('theme/index');

/* example */
const TableLayout = _import('example/table/index');
const DynamicTable = _import('example/table/dynamictable');
const Table = _import('example/table/table');
const DragTable = _import('example/table/dragTable');
const InlineEditTable = _import('example/table/inlineEditTable');

const Form = _import('example/form');
const Tab = _import('example/tab/index');

/* permission */
// const Permission = _import('permission/index');

Vue.use(Router);

/**
 * icon : the icon show in the sidebar
 * hidden : if hidden:true will not show in the sidebar
 * redirect : if redirect:noredirect will not redirct in the levelbar
 * noDropdown : if noDropdown:true will not has submenu
 * meta : { role: ['admin'] }  will control the page role
 **/

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('error/404'), hidden: true },
  { path: '/401', component: _import('error/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{ path: 'dashboard', component: _import('dashboard/index') }]
  },
  {
    path: '/introduction',
    component: Layout,
    redirect: '/introduction/index',
    icon: 'xinrenzhinan',
    noDropdown: true,
    children: [{ path: 'index', component: _import('introduction/index'), name: '简述' }]
  }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});