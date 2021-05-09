import _ from 'lodash';

export function paginate(items, pageNumber, pageSize){
    const startIndex = (pageNumber - 1) * pageSize;
    return _(items)
        .slice(startIndex)
        .take(pageSize)
        .value()
}

// const Pagination = (props) => {
//     const {itemsCount, pageSize, currentPage, onPageChange} = props;
//
//     const pagesCount = Math.ceil(itemsCount / pageSize);
//     if (pagesCount === 1) return null;
//     const pages = _.range(1, pagesCount + 1);
//
//     return (
//         <Nav>
//             <ul className="pagination ml-3">
//                 {pages.map(page => (
//                     <li key={page} className={ page === currentPage ? 'page-item active' : 'page-item'}>
//                         <a className="page-link" onClick={() => props.onPageChange(page)}>{page}</a>
//                     </li>
//                 ))}
//             </ul>
//         </Nav>
//     )
// }
//
// Pagination.propTypes = {
//     itemsCount: PropTypes.number.isRequired,
//     pageSize: PropTypes.number.isRequired,
//     currentPage: PropTypes.number.isRequired,
//     onPageChange: PropTypes.func.isRequired
// };
//
// export default Pagination;
