import {initResearchLab} from './research-lab.js';
initResearchLab();
import {initReportLab} from './report-lab.js';
initReportLab()();
document.getElementById('printReport').onclick=()=>window.print();
