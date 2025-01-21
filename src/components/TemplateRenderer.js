import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton } from '@mui/material';

const itemsPerFirstPage = 10;
const itemsPerSubsequentPage = 20;

const TemplateRenderer = ({ htmlTemplate, jsonData, editable, onFieldChange, onUpdateData, itemTemplate }) => {
    const templateContainer = useRef(null);

    useEffect(() => {
        if (templateContainer.current && htmlTemplate) {
            templateContainer.current.innerHTML = htmlTemplate;
            paginateItems();
            populateFields(templateContainer.current);
        }
    }, [htmlTemplate, jsonData]);

    const paginateItems = () => {
        const container = templateContainer.current;
        const items = jsonData?.items || [];

        const firstSection = container.querySelector('.item_section');
        if (!firstSection) return;

        // Vyčistíme všechny sekce kromě první
        container.querySelectorAll('.item_section').forEach((section, index) => {
            if (index > 0) section.remove();
        });

        let currentSection = firstSection;
        let itemsContainer = currentSection.querySelector('[data-item="items"]');
        itemsContainer.innerHTML = '';

        let currentItemCount = 0;
        let currentLimit = itemsPerFirstPage;

        items.forEach((item, index) => {
            if (currentItemCount >= currentLimit) {
                currentSection = createNewSection(firstSection);
                currentSection.style.marginTop = '20px';
                currentSection.style.pageBreakBefore = 'always';
                container.appendChild(currentSection);
                itemsContainer = currentSection.querySelector('[data-item="items"]');
                currentItemCount = 0;
                currentLimit = itemsPerSubsequentPage;
            }

            const row = createItemRow(item, 'items', index);
            itemsContainer.appendChild(row);
            currentItemCount++;
        });

        if (editable) {
            addAddButton(itemsContainer, 'items');
        }

        moveTotalsToLastPage(container);
    };

    const populateFields = (container) => {
        if (!jsonData) return;

        const processFields = (data, path = '') => {
            Object.keys(data).forEach((key) => {
                const fullPath = path ? `${path}.${key}` : key;
                const field = container.querySelector(`[data-field="${fullPath}"]`);

                if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
                    processFields(data[key], fullPath);
                } else if (field) {
                    field.textContent = data[key] || '';
                    if (editable) {
                        field.setAttribute('contentEditable', true);
                        field.classList.add('editable-highlight');
                        field.addEventListener('blur', (e) => onFieldChange(fullPath, e.target.innerText));
                    }
                }
            });
        };

        processFields(jsonData);
    };

    const createNewSection = (templateSection) => {
        const newSection = templateSection.cloneNode(true);
        const newItemsContainer = newSection.querySelector('[data-item="items"]');
        newItemsContainer.innerHTML = '';
        return newSection;
    };

    const createItemRow = (item, path, index) => {
        const row = document.createElement('tr');

        Object.keys(item).forEach((key) => {
            const cell = document.createElement('td');
            cell.textContent = item[key];
            if (editable) {
                cell.contentEditable = true;
                cell.classList.add('editable-highlight');
                cell.addEventListener('blur', (e) => onFieldChange(`${path}.${index}.${key}`, e.target.innerText));
            }
            row.appendChild(cell);
        });

        // Místo ReactDOM.render nově createRoot
        if (editable) {
            const removeButtonCell = document.createElement('td');
            const removeButtonRoot = createRoot(removeButtonCell);
            removeButtonRoot.render(
                <IconButton color="error" size="small" onClick={() => handleRemoveItem(path, index)}>
                    <DeleteIcon />
                </IconButton>
            );
            row.appendChild(removeButtonCell);
        }

        return row;
    };

    const addAddButton = (container, path) => {
        const addButtonRow = document.createElement('tr');
        const addButtonCell = document.createElement('td');
        addButtonCell.colSpan = 8;

        const addButtonRoot = createRoot(addButtonCell);
        addButtonRoot.render(
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleAddItem(path)}>
                Přidat položku
            </Button>
        );

        addButtonRow.appendChild(addButtonCell);
        container.appendChild(addButtonRow);
    };

    const moveTotalsToLastPage = (container) => {
        const totalsSection = container.querySelector('.footer');
        if (!totalsSection) return;

        totalsSection.remove();

        const allSections = container.querySelectorAll('.item_section');
        const lastSection = allSections[allSections.length - 1];
        lastSection.parentElement.appendChild(totalsSection);
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

    return <div ref={templateContainer} style={{ border: '1px solid #ddd', padding: '16px', marginTop: '16px' }} />;
};

export default TemplateRenderer;
