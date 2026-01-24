import Log from '../models/Log';

export const logSystemAction = async (
    module: string,
    description: string,
    user: { _id?: any; full_name?: string } | null,
    details?: any
) => {
    try {
        const userName = user?.full_name || 'Sistema/Desconhecido';
        const userId = user?._id || null;

        await Log.create({
            module,
            description,
            user_id: userId,
            user_name: userName,
            details
        });
    } catch (error) {
        console.error('Failed to create system log:', error);
        // Don't throw, just log the error so main flow isn't interrupted
    }
};
