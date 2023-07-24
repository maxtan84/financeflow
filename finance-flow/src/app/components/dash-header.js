export default function DashHeader( {title} ) {
    return (
        <div className="p-3 bg-gradient-to-r from-green-300 to-green-500">
            <h1 className="text-3xl font-semibold">{title}</h1>
        </div>
    )
}