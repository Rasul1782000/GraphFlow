'use client';
import { useState, useEffect } from 'react';
import { alertsApi, AlertDTO, AlertStats } from '@/lib/api/alerts';
import { marketApi, SymbolDTO } from '@/lib/api/market';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from 'primereact/inputswitch';
import { formatCurrency } from '@/lib/utils/formatters';

export function AlertsPage() {
    const [alerts, setAlerts] = useState<AlertDTO[]>([]);
    const [stats, setStats] = useState<AlertStats | null>(null);
    const [symbols, setSymbols] = useState<SymbolDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newAlert, setNewAlert] = useState({ symbol_id: '', name: '', condition_type: 'price_above', condition_value: 0, is_recurring: false });

    const conditionOptions = [{ label: 'Price Above', value: 'price_above' }, { label: 'Price Below', value: 'price_below' }];

    useEffect(() => {
        Promise.all([alertsApi.getAlerts(), alertsApi.getStats(), marketApi.getSymbols()])
            .then(([a, s, sy]) => { setAlerts(a); setStats(s); setSymbols(sy); })
            .catch(() => {}).finally(() => setLoading(false));
    }, []);

    const handleCreate = async () => {
        if (!newAlert.symbol_id || !newAlert.name || !newAlert.condition_value) return;
        try { const created = await alertsApi.create(newAlert); setAlerts(prev => [created, ...prev]); setShowCreate(false); setNewAlert({ symbol_id: '', name: '', condition_type: 'price_above', condition_value: 0, is_recurring: false }); } catch {}
    };

    const handleToggle = async (id: string, isActive: boolean) => {
        try { const updated = await alertsApi.update(id, { is_active: isActive }); setAlerts(prev => prev.map(a => a._id === id ? updated : a)); } catch {}
    };

    const handleDelete = async (id: string) => {
        try { await alertsApi.remove(id); setAlerts(prev => prev.filter(a => a._id !== id)); } catch {}
    };

    return (
        <div className="alerts-page">
            <div className="page-header"><div><h1>Notifications</h1><p className="subtitle">Price alerts and notification management</p></div><Button label="New Alert" icon="pi pi-plus" className="create-btn" onClick={() => setShowCreate(true)} /></div>
            {stats && (
                <div className="stats-row">
                    <div className="stat-card"><span className="stat-label">Total</span><span className="stat-value">{stats.total}</span></div>
                    <div className="stat-card"><span className="stat-label">Active</span><span className="stat-value text-green">{stats.active}</span></div>
                    <div className="stat-card"><span className="stat-label">Triggered</span><span className="stat-value text-blue">{stats.triggered}</span></div>
                </div>
            )}
            <DataTable value={alerts} loading={loading} className="alerts-table" responsiveLayout="scroll" emptyMessage="No alerts configured.">
                <Column header="Symbol" body={(rowData: AlertDTO) => <div className="flex-row gap-small align-center"><div className="ticker-icon">{rowData.symbol_id?.ticker?.[0] || '?'}</div><span className="ticker-main">{rowData.symbol_id?.ticker || 'N/A'}</span></div>} />
                <Column field="name" header="Alert Name" />
                <Column header="Condition" body={(rowData: AlertDTO) => <div className="flex-col"><span className="condition-type">{rowData.condition_type.replace('_', ' ')}</span><span className="condition-val mono">{formatCurrency(rowData.condition_value)}</span></div>} />
                <Column header="Status" body={(rowData: AlertDTO) => <InputSwitch checked={rowData.is_active} onChange={e => handleToggle(rowData._id, e.value)} className="status-switch" />} />
                <Column field="trigger_count" header="Triggers" style={{ textAlign: 'center' }} />
                <Column header="" body={(rowData: AlertDTO) => <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-sm delete-btn" onClick={() => handleDelete(rowData._id)} />} style={{ width: '60px' }} />
            </DataTable>
            <Dialog header="Create Alert" visible={showCreate} onHide={() => setShowCreate(false)} className="create-dialog" modal>
                <div className="dialog-form">
                    <div className="form-group"><label>Symbol</label><Dropdown value={newAlert.symbol_id} options={symbols.map(s => ({ label: `${s.ticker} - ${s.name}`, value: s._id }))} onChange={e => setNewAlert(prev => ({ ...prev, symbol_id: e.value }))} filter className="form-input" placeholder="Select symbol" /></div>
                    <div className="form-group"><label>Alert Name</label><InputText value={newAlert.name} onChange={e => setNewAlert(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., BTC Price Alert" className="form-input" /></div>
                    <div className="form-row">
                        <div className="form-group half"><label>Condition</label><Dropdown value={newAlert.condition_type} options={conditionOptions} onChange={e => setNewAlert(prev => ({ ...prev, condition_type: e.value }))} className="form-input" /></div>
                        <div className="form-group half"><label>Value</label><InputNumber value={newAlert.condition_value} onValueChange={e => setNewAlert(prev => ({ ...prev, condition_value: e.value || 0 }))} mode="currency" currency="USD" className="form-input" /></div>
                    </div>
                    <Button label="Create Alert" className="submit-btn" onClick={handleCreate} disabled={!newAlert.symbol_id || !newAlert.name || !newAlert.condition_value} />
                </div>
            </Dialog>
            <style jsx>{`
                .alerts-page { display: flex; flex-direction: column; gap: 1.5rem; }
                .page-header { display: flex; justify-content: space-between; }
                h1 { font-size: 1.75rem; color: #fff; font-weight: 800; margin: 0; }
                .subtitle { color: #555; font-size: 0.85rem; margin: 0.25rem 0 0; }
                :global(.create-btn) { background: #007bff !important; border: none !important; border-radius: 8px !important; font-weight: 700 !important; }
                .stats-row { display: flex; gap: 1rem; }
                .stat-card { background: #111; border: 1px solid #222; border-radius: 10px; padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
                .stat-label { font-size: 0.6rem; color: #555; text-transform: uppercase; font-weight: 800; }
                .stat-value { font-size: 1.25rem; font-weight: 800; color: #fff; }
                .flex-row { display: flex; flex-direction: row; }
                .flex-col { display: flex; flex-direction: column; }
                .gap-small { gap: 0.75rem; }
                .align-center { align-items: center; }
                .ticker-icon { width: 32px; height: 32px; background: #1a1a1a; border: 1px solid #222; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff; font-size: 0.8rem; }
                .ticker-main { font-weight: 700; color: #fff; font-size: 0.85rem; }
                .mono { font-family: 'var(--font-mono)', monospace; }
                .condition-type { font-size: 0.7rem; color: #555; text-transform: uppercase; font-weight: 800; }
                .condition-val { font-size: 0.9rem; color: #fff; font-weight: 700; }
                :global(.status-switch .p-inputswitch-slider) { background: #333; }
                :global(.delete-btn) { color: #dc3545 !important; }
                .text-green { color: #28a745; }
                .text-blue { color: #007bff; }
                :global(.create-dialog) { background: #111; border: 1px solid #222; }
                .dialog-form { display: flex; flex-direction: column; gap: 1rem; }
                .form-group label { font-size: 0.65rem; color: #555; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 0.5rem; }
                .form-row { display: flex; gap: 0.75rem; }
                .form-group.half { flex: 1; }
                :global(.form-input) { width: 100%; background: #0d1117 !important; border: 1px solid #222 !important; color: #fff !important; border-radius: 8px !important; }
                :global(.submit-btn) { background: #007bff !important; border: none !important; border-radius: 8px !important; font-weight: 700 !important; }
                :global(.alerts-table .p-datatable-thead > tr > th) { background: transparent; border-bottom: 1px solid #222; color: #555; font-size: 0.7rem; text-transform: uppercase; padding: 1.25rem 0.75rem; }
                :global(.alerts-table .p-datatable-tbody > tr) { background: transparent; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.03); }
            `}</style>
        </div>
    );
}
