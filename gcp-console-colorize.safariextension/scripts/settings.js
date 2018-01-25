(() => {
    const colors = {
        'red': '#f44336',
        'pink': '#e91e63',
        'purple': '#9c27b0',
        'deep-purple': '#673ab7',
        'indigo': '#3f51b5',
        'blue': '#2196f3',
        'light-blue': '#03a9f4',
        'cyan': '#00bcd4',
        'teal': '#009688',
        'green': '#4caf50',
        'light-green': '#8bc34a',
        'lime': '#cddc39',
        'yellow': '#ffeb3b',
        'amber': '#ffc107',
        'orange': '#ff9800',
        'deep-orange': '#ff5722',
        'brown': '#795548',
        'grey': '#9e9e9e',
        'blue-grey': '#607d8b',
        'black': '#000000',
        'white': '#ffffff'
    };
    const paletteWidth = 4;
    const palette = colors => Object.keys(colors).reduce((accumlator, key) => {
        const value = colors[key];
        const lastRow = accumlator[accumlator.length - 1];
        if (lastRow.length == paletteWidth) {
            const newRow = [value];
            accumlator.push(newRow);
        } else {
            lastRow.push(value);
        }
        return accumlator
    }, [[]]);
    const setSpectrum = ($element, value) => $element.val(value || colors['red']).spectrum({
        showPaletteOnly: true,
        togglePaletteOnly: true,
        togglePaletteMoreText: 'もっと選ぶ',
        togglePaletteLessText: '既定色',
        showInitial: true,
        showInput: true,
        preferredFormat: 'hex',
        palette: palette(colors),
    });
    const $original = $(`[data-phrase=0]`).clone();
    const addRow = () => {
        const index = $('[data-phrase]').last().data('phrase') + 1;
        const $newRow = $original.clone().attr({'data-phrase': index});
        $('[data-phrase-text]', $newRow).attr({
            id: `phrase-${index}`,
            name: `phrase-${index}`,
        });
        const $color = $('[data-color-text]', $newRow).attr({
            id: `color-${index}`,
            name: `color-${index}`
        });
        setSpectrum($color);
        $('[data-add-button]', $newRow).attr({name: `add-${index}`}).on('click', () => addRow());
        $('[data-delete-button]', $newRow).attr({name: `delete-${index}`}).removeAttr('disabled').on('click', () => deleteRow(index));
        $('[data-phrase]').last().after($newRow);
    };
    const deleteRow = index => $(`[data-phrase=${index}]`).remove();
    const setValues = phrases => phrases.forEach((phrase, index) => {
        if (!$(`[data-phrase=${index}]`).length) {
            addRow();
        }
        $(`[name=phrase-${index}]`).val(phrase.value);
        setSpectrum($(`[name=color-${index}]`), phrase.color);
    });
    const start = options => {
        Utils.log(options);
        const phrases = options.phrases ? JSON.parse(options.phrases) : [{}];
        setValues(phrases);
        $('[name=add-0]').on('click', () => addRow());
    };
    Events.call({action: 'get-options'}, start);
})();
