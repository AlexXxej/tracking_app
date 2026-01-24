import { SelectList } from '../ui/SelectList'

const PAUSE_ITEM = {
  id: 'pause-hardcoded',
  name: 'Pause',
  isPauseOption: true
}

export function TaetigkeitSelect({ taetigkeitstypen, onSelect, loading }) {
  const itemsWithPause = [...taetigkeitstypen, PAUSE_ITEM]

  return (
    <SelectList
      items={itemsWithPause}
      onSelect={onSelect}
      loading={loading}
      title="Tätigkeit wählen"
      emptyMessage="Keine Tätigkeitstypen vorhanden"
    />
  )
}
