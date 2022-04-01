import { useEffect } from 'react';
import { emit, listen, Event } from '@tauri-apps/api/event';
// import { useExplorerStore } from '../store/explorer';
import { CoreEvent } from '../../../../core';
import { useQuery, useQueryClient } from 'react-query';

export function useCoreEvents() {
  const client = useQueryClient();
  useEffect(() => {
    listen('core_event', (e: Event<CoreEvent>) => {
      switch (e.payload?.key) {
        case 'InvalidateQuery':
        case 'InvalidateQueryDebounced':
          let query = [e.payload.data.key];
          // TODO: find a way to make params accessible in TS
          // also this method will only work for queries that use the whole params obj as the second key
          // @ts-expect-error
          if (e.payload.data.params) {
            // @ts-expect-error
            query.push(e.payload.data.params);
          }
          client.invalidateQueries(e.payload.data.key);
          break;

        default:
          break;
      }
    });
  }, []);
}
