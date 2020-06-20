import * as React from 'react';

interface IMenuOption {
    value: string;
    label: string;
}

interface ISelectClassNames {
    wrapper1: string;
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

const complement = <T, U>(f: (x: T) => boolean) => (x: T) => !f(x);

const SelectProps: React.FunctionComponent<ISelectProps> = ({
    allOptionLabelDeselect,
    allOptionLabelSelect,
    allOptionValue,
    allowSelectAll,
    onChange,
    options,
    placeholder,
    value,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const selectedValuesContains = (x: { label: string; value: string; }) => value
        .some(y => y.label === x.label && y.value === y.value);

    const titleText = 'title text placeholder';

    const getOptionClicker = (option: IMenuOption) => () => {
        if (option.value === allOptionValue) {
            value.length === options.length ? onChange(options) : onChange(options.filter(complement(selectedValuesContains)));
            return;
        }

        onChange([option]);
    }

    const toggleIsOpen = () => setIsOpen(!isOpen);

    return <div>
        <button onClick={toggleIsOpen}>{titleText}</button>
        {isOpen
            ?
            (
                <div>
                    {
                        allowSelectAll
                            ? (
                                <button onClick={getOptionClicker({ label: allOptionLabelSelect, value: allOptionValue })}>{allOptionLabelSelect}</button>
                            )
                            : null
                    }
                    {
                        options.map(o => (
                            <button onClick={getOptionClicker(o)}><input type="checkbox" checked={selectedValuesContains(o)} />{o.label}</button>
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