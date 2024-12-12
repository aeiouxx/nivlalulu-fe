import React, { useEffect, useRef } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton } from '@mui/material';

const TemplateRenderer = ({ htmlTemplate, jsonData, editable, onFieldChange, onUpdateData, itemTemplate }) => {
    const templateContainer = useRef(null);

    useEffect(() => {
        if (templateContainer.current && htmlTemplate) {
            templateContainer.current.innerHTML = htmlTemplate;
            populateFields(templateContainer.current);
        }
    }, [htmlTemplate, jsonData]);

    const populateFields = (container) => {
        if (!jsonData) return;

        cleanEventListeners(container);

        const processFields = (data, path = '') => {
            Object.keys(data).forEach((key) => {
                const fullPath = path ? `${path}.${key}` : key;
                const field = container.querySelector(`[data-field="${fullPath}"]`);

                if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
                    processFields(data[key], fullPath);
                } else if (Array.isArray(data[key])) {
                    const itemsContainer = container.querySelector(`[data-item="${fullPath}"]`);
                    if (itemsContainer) {
                        itemsContainer.innerHTML = '';
                        data[key].forEach((item, index) => {
                            const itemRow = createItemRow(item, fullPath, index);
                            itemsContainer.appendChild(itemRow);
                        });

                        if (editable) {
                            const addButton = (
                                <Button
                                    onClick={() => handleAddItem(fullPath)}
                                    title="Přidat položku"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <AddIcon />
                                </Button>
                            );

                            const addButtonWrapper = document.createElement('div');
                            addButtonWrapper.className = 'add-button-wrapper';
                            addButtonWrapper.appendChild(createReactElement(addButton));
                            itemsContainer.appendChild(addButtonWrapper);
                        }
                    }
                } else if (field) {
                    field.textContent = data[key] || '';
                    if (editable) {
                        field.setAttribute('contentEditable', true);
                        field.classList.add('editable-highlight');
                        field.addEventListener('blur', (e) => {
                            onFieldChange && onFieldChange(fullPath, e.target.innerText);
                        });
                    }
                }
            });
        };

        const createItemRow = (item, path, index) => {
            const itemRow = document.createElement('tr');

            Object.keys(item).forEach((itemKey) => {
                const cell = document.createElement('td');
                cell.textContent = item[itemKey];
                if (editable) {
                    cell.contentEditable = true;
                    cell.addEventListener('blur', (e) => onFieldChange(`${path}.${index}.${itemKey}`, e.target.innerText));
                }
                itemRow.appendChild(cell);
            });

            if (editable) {
                const removeButtonCell = document.createElement('td');
                removeButtonCell.style.textAlign = 'center'; // Zarovnat na střed

                const buttonWrapper = document.createElement('div');
                buttonWrapper.style.display = 'inline-block';
                buttonWrapper.style.margin = '0 4px';

                const removeButton = (
                    <IconButton color="error" size="small" onClick={() => handleRemoveItem(path, index)}>
                        <DeleteIcon />
                    </IconButton>
                );

                import('react-dom').then((ReactDOM) => {
                    ReactDOM.render(removeButton, buttonWrapper);
                });

                removeButtonCell.appendChild(buttonWrapper);
                itemRow.appendChild(removeButtonCell);
            }

            return itemRow;
        };

        processFields(jsonData);
    };

    // Pomocná funkce pro vytvoření React elementu a jeho vložení do DOM
    const createReactElement = (element) => {
        const container = document.createElement('div');
        import('react-dom').then((ReactDOM) => {
            ReactDOM.render(element, container);
        });
        return container;
    };

    const handleAddItem = (path) => {
        onUpdateData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            const keys = path.split('.');
            let current = newData;

            keys.forEach((key) => {
                if (!current[key]) current[key] = [];
                current = current[key];
            });

            current.push({ ...itemTemplate });
            return newData;
        });
    };

    const handleArrayFieldChange = (path, index, field, value) => {
        onUpdateData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            const keys = path.split('.');
            let current = newData;

            keys.forEach((key) => {
                current = current[key];
            });

            current[index][field] = value;
            return newData;
        });
    };

    const handleRemoveItem = (path, index) => {
        onUpdateData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            const keys = path.split('.');
            let current = newData;

            keys.forEach((key) => {
                current = current[key];
            });

            current.splice(index, 1);
            return newData;
        });
    };

    const cleanEventListeners = (container) => {
        const elements = container.querySelectorAll('[contentEditable="true"], button');
        elements.forEach((el) => {
            const newEl = el.cloneNode(true);
            el.replaceWith(newEl);
        });
    };

    return <div ref={templateContainer} style={{ border: '1px solid #ddd', padding: '16px', marginTop: '16px' }} />;
};

export default TemplateRenderer;