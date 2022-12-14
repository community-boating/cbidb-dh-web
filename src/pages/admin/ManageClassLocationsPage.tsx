import * as React from "react";
import * as t from "io-ts";
import { FormGroup, Label, Col, Input, CustomInput } from "reactstrap";
import { Check as CheckIcon } from "react-feather";

// Table building utilities
import { StringifiedProps } from "util/StringifyObjectProps";

// Validator and putter for the data type of this page
import { classLocationValidator } from "async/rest/class-locations";
import { putWrapper as putClassLocation } from "async/rest/class-locations";

// The common display structure which is a table editable via modal
import ReportWithModalForm from "components/ReportWithModalForm";
import { CellBooleanIcon, SortTypeBoolean } from "util/tableUtil";
import { ColumnDef } from "@tanstack/react-table";

type ClassLocation = t.TypeOf<typeof classLocationValidator>;

export default function ManageClassLocationsPage(props: {
	locations: ClassLocation[];
}) {
	// Define table columns
	const columns: ColumnDef<ClassLocation>[] = [
	{
		accessorKey: "LOCATION_ID",
		header: "ID",
		size: 80,
	}, {
		accessorKey: "LOCATION_NAME",
		header: "Name",
	}, {
		accessorKey: "ACTIVE",
		header: "Active",
		size: 100,
		cell: CellBooleanIcon(<CheckIcon color="#777" size="1.4em" />),
		sortingFn: SortTypeBoolean
	}];

	// Define edit/add form
	const formComponents = (
		rowForEdit: StringifiedProps<ClassLocation>,
		updateState: (id: string, value: string | boolean) => void
	) => (
		<React.Fragment>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					ID
				</Label>
				<Col sm={9}>
					<div style={{ padding: "5px" }} className="text-left">
						{rowForEdit.LOCATION_ID || "(none)"}
					</div>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={3} className="text-sm-right">
					Location Name
				</Label>
				<Col sm={9}>
					<Input
						type="text"
						name="tagName"
						placeholder="Class Location Name"
						value={rowForEdit.LOCATION_NAME}
						onChange={(event) =>
							updateState("LOCATION_NAME", event.target.value)
						}
					/>
				</Col>
			</FormGroup>

			<FormGroup row className="align-items-center">
				<Label sm={3} className="text-sm-right">
					Active
				</Label>
				<Col sm={9}>
					<CustomInput
						type="checkbox"
						id="isActive"
						checked={rowForEdit.ACTIVE == "Y"}
						className="text-left"
						onChange={(event) => updateState("ACTIVE", event.target.checked)}
					/>
				</Col>
			</FormGroup>
		</React.Fragment>
	);

	return (
		<ReportWithModalForm
			rowValidator={classLocationValidator}
			rows={props.locations}
			primaryKey="LOCATION_ID"
			columns={columns}
			formComponents={formComponents}
			submitRow={putClassLocation}
			cardTitle="Manage Class Locations"
		/>
	);
}
