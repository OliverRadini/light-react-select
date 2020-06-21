import * as React from 'react';

interface IMenuOption {
    value: string;
    label: string;
}

interface ISelectClassNames {
    wrapper?: string;
    placeholderButton?: string;
    optionsSectionWrapper?: string;
    optionsButton?: string;
    optionCheckbox?: string;
}

interface ISelectProps {
    allOptionLabelDeselect: IMenuOption['label']; // eslint-disable-line
    allOptionLabelSelect: IMenuOption['label']; // eslint-disable-line
    allOptionValue: IMenuOption['value']; // eslint-disable-line
    allowSelectAll: boolean;
    classNames?: ISelectClassNames;
    onChange: (options: IMenuOption[] | IMenuOption) => any| null;
    options: IMenuOption[],
    placeholder?: string;
    value: IMenuOption[];
}

type Predicate<T> = (x: T) => boolean;

const complement = <T, U>(f: Predicate<T>) => (x: T) => !f(x);
const PLACEHOLDER_LENGTH = 5;

const formOptionsToPlaceholderText = (placeholder: string, maxLength: number) =>
    (values: { label: string; value: string; }[]) => {
        if (values.length === 0) {
            return placeholder;
        }

        const joinedValues = values.map(x => x.label).join(', ');

        if (joinedValues.length > maxLength) {
            return `${joinedValues.substring(0, maxLength)}...`;
        }

        return joinedValues;
    }

const SelectProps: React.FunctionComponent<ISelectProps> = ({
    allOptionLabelDeselect,
    allOptionLabelSelect,
    allOptionValue,
    allowSelectAll,
    classNames,
    onChange,
    options,
    placeholder,
    value,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const selectedValuesContains = (x: { label: string; value: string; }) => value
        .some(y => y.label === x.label && y.value === y.value);

    const titleText = formOptionsToPlaceholderText(placeholder || 'Select', PLACEHOLDER_LENGTH)(value);

    const getOptionClicker = (option: IMenuOption) => () => {
        if (option.value === allOptionValue) {
            value.length === options.length ? onChange(options) : onChange(options.filter(complement(selectedValuesContains)));
            return;
        }

        onChange([option]);
    }

    const toggleIsOpen = () => setIsOpen(!isOpen);

    return <div className={classNames?.wrapper}>
        <button className={classNames?.placeholderButton} onClick={toggleIsOpen}>{titleText}</button>
        {isOpen
            ?
            (
                <div>
                    {
                        allowSelectAll
                            ? (
                                <button
                                    onClick={getOptionClicker({ label: allOptionLabelSelect, value: allOptionValue })}
                                    className={classNames?.optionsButton}
                                >
                                    {value.length === options.length ? allOptionLabelDeselect : allOptionLabelSelect}
                                </button>
                            )
                            : null
                    }
                    {
                        options.map(o => (
                            <button 
                                onClick={getOptionClicker(o)}
                                className={classNames?.optionsButton}
                            >
                                <input
                                    className={classNames?.optionCheckbox} 
                                    type="checkbox"
                                    checked={selectedValuesContains(o)}
                                />
                                {o.label}
                            </button>
                        ))
                    }
                </div>
            )
            :
            null
        }
    </div>
};

export default SelectProps;