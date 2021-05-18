

const authentication = () => {

    if (localStorage.getItem('adminRole') === 'DEFAULT')
        return 'employee';
    else if (localStorage.getItem('adminRole') === 'GROUP_LEADER')
        return 'group_leader';
    else if (localStorage.getItem('adminRole') === 'HR_EMPLOYEE')
        return 'hr_employee';
    else if (localStorage.getItem('adminRole') === 'ADMIN')
        return 'admin';

    return 'NOT_AUTHENTICATED';

}

export default authentication;
