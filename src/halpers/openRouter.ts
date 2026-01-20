import { OpenRouter } from '@openrouter/sdk';
import config from '../config';

export const openRouter = new OpenRouter({
    apiKey: config.ai.open_router,
});

