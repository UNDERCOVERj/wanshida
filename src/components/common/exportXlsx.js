import XLSX from 'xlsx'
import FileSaver from 'file-saver'
export default (data, header) => {
    let ws = XLSX.utils.json_to_sheet(data);
    Object.keys(ws).forEach((key) => {
        if(header[ws[key].v]) {
            ws[key].v = header[ws[key].v];
        }
    })
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    const wbout = XLSX.write(wb, {type:"array", bookType:"xlsx"});
    FileSaver.saveAs(new Blob([wbout],{type:"application/octet-stream"}), "sheetjs.xlsx");
}