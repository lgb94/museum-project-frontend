import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageTitle = () => {
    const location = useLocation();

    useEffect(() => {
        const titles = [
            { pattern: /^\/$/, title: 'M U S E U M P R O J E C T' },
            { pattern: /^\/objects$/, title: 'S E A R C H' },
            { pattern: /^\/objects\/\d+$/, title: 'O B J E C T' },
            { pattern: /^\/exhibits$/, title: 'E X H I B I T S' },
            { pattern: /^\/exhibits\/create$/, title: 'C R E A T E' },
            { pattern: /^\/exhibits\/\d+$/, title: 'E X H I B I T' },
            { pattern: /^\/exhibits\/\d+\/\d+$/, title: 'E X H I B I T - O B J E C T' },
            { pattern: /^\/user\/\d+$/, title: 'U S E R' },
            { pattern: /^.*$/, title: 'E R R O R' } 
        ];

        const match = titles.find(({ pattern }) => pattern.test(location.pathname));
        document.title = match ? match.title : 'M U S E U M P R O J E C T';
    }, [location]);

    return null;
};

export default PageTitle;
