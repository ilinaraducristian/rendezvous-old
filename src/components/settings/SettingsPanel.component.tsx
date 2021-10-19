import styles from "./SettingsPanel.module.css";
import ButtonComponent from "components/ButtonComponent";
import {DetailedHTMLProps, HTMLAttributes, ReactNode, useState} from "react";
import XSVG from "svg/XSVG/X.svg";
import {useAppDispatch} from "state-management/store";
import {setOverlay} from "state-management/slices/data/data.slice";

type ComponentProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    categories?: { name: string, children: { name: string, body: ReactNode }[] }[]
};

function SettingsPanelComponent({className, categories, ...props}: ComponentProps) {

    const dispatch = useAppDispatch();

    const [selected, setSelected] = useState((categories ?? []).length > 0 ? {category: 0, child: 0} : {
        category: -1,
        child: -1,
    });

    function closeSettingsPanel() {
        dispatch(setOverlay(null));
    }

    return (
        <div className={`${styles.container} ${className ?? ""}`} {...props}>
            <div className={styles.firstPanel}>
                <ul className={`list ${styles.ul}`}>
                    {categories?.map((category, catIndex) => [
                        catIndex === 0 ||
                        (
                            <li className={`${styles.separator}`} key={`category_separator_${catIndex - 1}`}/>
                        ),
                        (
                            <li key={`category_name_${catIndex}`}>
                                <h5>{category.name}</h5>
                            </li>
                        ),
                        category.children.map((child, childIndex) => (
                            <li key={`category_child${catIndex * 10 + childIndex}`}>
                                <ButtonComponent
                                    className={`${selected.category === catIndex && selected.child === childIndex ? styles.buttonSelected : ""}`}
                                    onClick={() => setSelected({
                                        category: catIndex,
                                        child: childIndex,
                                    })}>{child.name}</ButtonComponent>
                            </li>
                        )).flat(),
                    ])}
                </ul>
            </div>
            <div className={styles.secondPanel}>
                <div className={styles.body}>
                    {
                        categories === undefined ||
                        categories[selected.category]?.children[selected.child]?.body
                    }
                </div>
                <div className={styles.closeContainer}>
                    <ButtonComponent onClick={closeSettingsPanel}>
                        <div>
                            <XSVG width={18} height={18}/>
                        </div>
                        <span>ESC</span>
                    </ButtonComponent>
                </div>
            </div>
        </div>
    );
}

export default SettingsPanelComponent;