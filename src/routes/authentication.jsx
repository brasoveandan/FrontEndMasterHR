

const authentication = () => {

    if (sessionStorage.getItem('adminRole') === 'DEFAULT')
        return 'employee';
    else if (sessionStorage.getItem('adminRole') === 'GROUP_LEADER')
        return 'group_leader';
    else if (sessionStorage.getItem('adminRole') === 'HR_EMPLOYEE')
        return 'hr_employee';
    else if (sessionStorage.getItem('adminRole') === 'ADMIN')
        return 'admin';

    return 'NOT_AUTHENTICATED';

}

export default authentication;
