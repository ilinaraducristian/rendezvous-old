export default function NotificationsSVG({muted}) {
    return (
        muted ?
            <svg x="0" y="0" className="icon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
                <path className="muted-bar" fill="currentColor"
                      d="M21.178 1.70703L22.592 3.12103L4.12103 21.593L2.70703 20.178L21.178 1.70703Z"/>
                <path fill="currentColor" d="M18 10.5283L10.5287 18H21V17C19.344 17 18 15.657 18 14V10.5283Z"/>
                <path fill="currentColor"
                      d="M8.957 19.5718L9.52877 19H15.4449C14.7519 20.19 13.4759 21 11.9999 21C10.7748 21 9.68752 20.442 8.957 19.5718Z"/>
                <path fill="currentColor"
                      d="M12 3C13.417 3 14.71 3.5 15.734 4.321L5.99805 14.058C5.99805 14.0479 5.99856 14.038 5.99907 14.0283C5.99956 14.0188 6.00005 14.0094 6.00005 14V9C6.00005 5.686 8.68605 3 12 3Z"/>
            </svg>
            :
            <svg x="0" y="0" className="icon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"
                 fill="none">
                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd"
                      d="M18 9V14C18 15.657 19.344 17 21 17V18H3V17C4.656 17 6 15.657 6 14V9C6 5.686 8.686 3 12 3C15.314 3 18 5.686 18 9ZM11.9999 21C10.5239 21 9.24793 20.19 8.55493 19H15.4449C14.7519 20.19 13.4759 21 11.9999 21Z"/>
            </svg>
    );
}
