import { useEffect, useMemo, useState } from 'react';
import { useUserContentStore } from '../store/userContentStore.js';
import { CONTENT_CATEGORIES } from '../constants/constants.js';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const useUserContents = () => {
    const { contents, loading, error, fetchContents } = useUserContentStore();

    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        fetchContents();
    }, [fetchContents]);

    // Conteo de contenidos por categoría, para el estante lateral
    const categoryCounts = useMemo(() => {
        const counts = { ALL: contents.length };
        CONTENT_CATEGORIES.forEach((cat) => {
            counts[cat] = contents.filter((c) => c.category === cat).length;
        });
        return counts;
    }, [contents]);

    const filteredContents = useMemo(() => {
        const q = search.trim().toLowerCase();
        return contents.filter((c) => {
            const matchCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
            const matchType = typeFilter === 'ALL' || c.type === typeFilter;
            const matchSearch = !q || (c.title || '').toLowerCase().includes(q);
            return matchCategory && matchType && matchSearch;
        });
    }, [contents, categoryFilter, typeFilter, search]);

    // Agrupa por recencia, igual que la biblioteca de referencia
    const groupedContents = useMemo(() => {
        const now = Date.now();
        const recent = [];
        const older = [];
        filteredContents.forEach((c) => {
            const createdAt = c.createdAt ? new Date(c.createdAt).getTime() : 0;
            if (now - createdAt <= THIRTY_DAYS_MS) {
                recent.push(c);
            } else {
                older.push(c);
            }
        });
        return { recent, older };
    }, [filteredContents]);

    const selectedContent = useMemo(
        () => contents.find((c) => c._id === selectedId) ?? null,
        [contents, selectedId]
    );

    // Mantiene una selección válida cuando cambian los filtros o llegan datos
    useEffect(() => {
        if (filteredContents.length === 0) {
            setSelectedId(null);
            return;
        }
        if (!filteredContents.some((c) => c._id === selectedId)) {
            setSelectedId(filteredContents[0]._id);
        }
    }, [filteredContents, selectedId]);

    return {
        contents: filteredContents,
        groupedContents,
        categoryCounts,
        loading,
        error,
        categoryFilter,
        setCategoryFilter,
        typeFilter,
        setTypeFilter,
        search,
        setSearch,
        selectedContent,
        selectedId,
        setSelectedId,
        totalContents: contents.length,
    };
};