import { Hono } from "hono";
import { Env } from './core-utils';

export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Add more routes like this. **DO NOT MODIFY CORS OR OVERRIDE ERROR HANDLERS**
    app.get('/api/test', (c) => c.json({ success: true, data: { name: 'this works' }}));

    app.get('/api/admin/stats', (c) => c.json({
        success: true, 
        data: {
            flowCount: 3, 
            activeFlows: 1, 
            nodeCount: 25, 
            uptime: 12345, 
            isInitialized: true
        }
    }));

    app.get('/api/admin/nodes', (c) => c.json({
        success: true, 
        data: [
            {
                type: 'http in', 
                category: 'input', 
                color: '#ff6b6b', 
                defaults: {}, 
                inputs: 0, 
                outputs: 1, 
                icon: 'wifi', 
                label: 'HTTP Input', 
                paletteLabel: 'HTTP In'
            }, 
            {
                type: 'debug', 
                category: 'function', 
                color: '#4ecdc4', 
                defaults: {}, 
                inputs: 1, 
                outputs: 0, 
                icon: 'bug', 
                label: 'Debug Node'
            }
        ]
    }));

    app.get('/api/admin/flows', (c) => c.json({
        success: true, 
        data: [
            {
                id: 'demo-flow-1', 
                label: 'Demo Flow', 
                nodes: [], 
                enabled: true, 
                updated_at: new Date().toISOString(), 
                description: 'Sample flow'
            }
        ]
    }));

    app.post('/api/admin/init', (c) => c.json({
        success: true, 
        data: { message: 'Mock system initialization complete. DB deferred.' }
    }));

    app.get('/api/admin/flows/:id', async (c) => {
        const id = c.req.param('id');
        return c.json({
            success: true, 
            data: {
                id, 
                label: `Flow ${id}`, 
                nodes: [], 
                enabled: false, 
                description: `Editor for flow ${id}`
            }
        });
    });
}
