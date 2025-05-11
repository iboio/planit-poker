import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
} from "@/components/ui/table";

interface VoteTableProps {
    votes: { value: string, role: string }[];
}

const VoteTable: React.FC<VoteTableProps> = ({votes}) => {
    const uniqueRoles = [...new Set(votes.map(user => user.role))];

    // Calculate average of numeric votes
    function calculateAverage(role: string) {
        const filteredVotes = votes.filter(vote => vote.role === role);
        const numbers = filteredVotes
            .map(vote => Number(vote.value))
            .filter(num => !isNaN(num));

        if (numbers.length === 0) return 0;

        const total = numbers.reduce((sum, num) => sum + num, 0);
        return Math.round(total / numbers.length);
    }

    function frequencyCount(role: string) {
        const filteredVotes = votes.filter(vote => vote.role === role);
        const frequency: { [key: string]: number } = {};
        filteredVotes.forEach(vote => {
            frequency[vote.value] = (frequency[vote.value] || 0) + 1;
        });
        return frequency;
    }

    return (
        <div className="rounded-md border overflow-auto">
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow className="grid grid-cols-12">
                        <TableHead
                            className="col-span-6 py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Vote</TableHead>
                        <TableHead
                            className="col-span-6 py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Count</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {votes.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={12} className="py-6 text-center text-gray-500">
                                No votes yet
                            </TableCell>
                        </TableRow>
                    )}
                    {/* Display average row with special styling */}
                    {uniqueRoles.map((role, index) => (
                        <TableRow key={index} className="grid grid-cols-12 bg-blue-50">
                            <TableCell className="col-span-6 py-3 px-4 text-sm font-bold">{role}</TableCell>
                            <TableCell
                                className="col-span-6 py-3 px-4 text-sm font-bold">{calculateAverage(role)}</TableCell>
                        </TableRow>
                    ))}
                    {/* Show empty state if no votes */}
                    {uniqueRoles.map((role) => {
                        const freq = frequencyCount(role);

                        return Object.entries(freq).map(([voteValue, count]) => (
                            <TableRow key={`${role}-${voteValue}`} className="grid grid-cols-12">
                                <TableCell className="col-span-6 py-3 px-4 text-sm font-medium">
                                    {voteValue} ({role})
                                </TableCell>
                                <TableCell className="col-span-6 py-3 px-4 text-sm">
                                    <div className="flex items-center">
                                        <span className="mr-2">{count}</span>
                                        <div className="relative w-full h-2 bg-gray-200 rounded">
                                            <div
                                                className="absolute h-2 bg-blue-500 rounded"
                                                style={{width: `${(count / votes.length) * 100}%`}}
                                            ></div>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ));
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default VoteTable;