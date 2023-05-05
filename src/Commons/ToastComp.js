import Swal from "sweetalert2"

const theme = window.localStorage.getItem('currentOMSTheme');

var bgColor = '';
if (theme === 'dark') {
    bgColor = '#343a40';
}

export function ToastComp(type, message) {

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: type,
        title: message,
        background: bgColor
    })
}

export function SwalComp(icon, html, confirmBtnText, cancelBtnText) {
    return Swal.fire({
        icon: icon,
        html: html,
        background: bgColor,
        showConfirmButton: true,
        confirmButtonText: confirmBtnText,
        showCancelButton: true,
        cancelButtonText: cancelBtnText || 'Cancel',
        reverseButtons: true
    })
}

export function reloadWindow() {
    return window.setTimeout(() => {
        window.location.reload();
    }, 2100);
}