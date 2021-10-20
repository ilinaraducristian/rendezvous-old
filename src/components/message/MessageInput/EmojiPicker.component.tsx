import styles from "./EmojiPicker.module.css";
import EmojiComponent from "components/message/MessageInput/Emoji.component";
import ButtonComponent from "components/ButtonComponent";

type ComponentProps = {
    selectEmoji: (index: number) => void
}

function EmojiPickerComponent({selectEmoji}: ComponentProps) {
    return (
        <div className={styles.div}>
            {new Array(42 * 38).fill(0).map((_, index) => (
                <ButtonComponent onClick={() => selectEmoji(index)}>
                    <EmojiComponent key={`emoji_component_${index}`} index={index}/>
                </ButtonComponent>
            ))}
        </div>
    );
}

export default EmojiPickerComponent;