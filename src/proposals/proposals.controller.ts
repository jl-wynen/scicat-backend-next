import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ProposalsService } from "./proposals.service";
import { CreateProposalDto } from "./dto/create-proposal.dto";
import { UpdateProposalDto } from "./dto/update-proposal.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PoliciesGuard } from "src/casl/guards/policies.guard";
import { CheckPolicies } from "src/casl/decorators/check-policies.decorator";
import { AppAbility } from "src/casl/casl-ability.factory";
import { Action } from "src/casl/action.enum";
import { Proposal, ProposalDocument } from "./schemas/proposal.schema";
import { FilterQuery } from "mongoose";
import { AttachmentsService } from "src/attachments/attachments.service";
import { Attachment } from "src/attachments/schemas/attachment.schema";
import { CreateAttachmentDto } from "src/attachments/dto/create-attachment.dto";
import { UpdateAttachmentDto } from "src/attachments/dto/update-attachment.dto";
import { DatasetsService } from "src/datasets/datasets.service";
import { Dataset } from "src/datasets/schemas/dataset.schema";
import {
  IProposalFacets,
  IProposalFilters,
} from "./interfaces/proposal-filters.interface";

@ApiBearerAuth()
@ApiTags("proposals")
@Controller("proposals")
export class ProposalsController {
  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly datasetsService: DatasetsService,
    private readonly proposalsService: ProposalsService,
  ) {}

  // POST /proposals
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Proposal))
  @Post()
  async create(
    @Body() createProposalDto: CreateProposalDto,
  ): Promise<Proposal> {
    return this.proposalsService.create(createProposalDto);
  }

  // GET /proposals
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Proposal))
  @Get()
  async findAll(
    @Query() filters?: FilterQuery<ProposalDocument>,
  ): Promise<Proposal[]> {
    const proposalFilters = filters ?? {};
    return this.proposalsService.findAll(proposalFilters);
  }

  // GET /fullquery
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Proposal))
  @Get("/fullquery")
  async fullquery(
    @Query() filters: { fields?: string; limits?: string },
  ): Promise<Proposal[]> {
    const parsedFilters: IProposalFilters = {
      fields: JSON.parse(filters.fields ?? "{}"),
      limits: JSON.parse(filters.limits ?? "{}"),
    };
    return this.proposalsService.fullquery(parsedFilters);
  }

  // GET /fullfacet
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Proposal))
  @Get("/fullfacet")
  async fullfacet(
    @Query() filters: { fields?: string; facets?: string },
  ): Promise<Record<string, unknown>[]> {
    const parsedFilters: IProposalFacets = {
      fields: JSON.parse(filters.fields ?? "{}"),
      facets: JSON.parse(filters.facets ?? "[]"),
    };
    return this.proposalsService.fullfacet(parsedFilters);
  }

  // GET /proposals/:id
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Proposal))
  @Get("/:id")
  async findOne(@Param("id") id: string): Promise<Proposal | null> {
    return this.proposalsService.findOne({ proposalId: id });
  }

  // PATCH /proposals/:id
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Proposal))
  @Patch("/:id")
  async update(
    @Param("id") id: string,
    @Body() updateProposalDto: UpdateProposalDto,
  ): Promise<Proposal | null> {
    return this.proposalsService.update({ proposalId: id }, updateProposalDto);
  }

  // DELETE /proposals/:id
  @UseGuards()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Proposal))
  @Delete("/:id")
  async remove(@Param("id") id: string): Promise<unknown> {
    return this.proposalsService.remove({ proposalId: id });
  }

  // POST /proposals/:id/attachments
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Attachment),
  )
  @Post("/:id/attachments")
  async createAttachment(
    @Param("id") id: string,
    @Body() createAttachmentDto: CreateAttachmentDto,
  ): Promise<Attachment> {
    const createAttachment = { ...createAttachmentDto, proposalId: id };
    return this.attachmentsService.create(createAttachment);
  }

  // GET /proposals/:id/attachments
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Attachment))
  @Get("/:id/attachments")
  async findAllAttachments(@Param("id") id: string): Promise<Attachment[]> {
    return this.attachmentsService.findAll({ proposalId: id });
  }

  // PATCH /proposals/:id/attachments/:fk
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Attachment),
  )
  @Patch("/:id/attachments/:fk")
  async findOneAttachmentAndUpdate(
    @Param("id") proposalId: string,
    @Param("fk") attachmentId: string,
    @Body() updateAttachmentDto: UpdateAttachmentDto,
  ): Promise<Attachment | null> {
    return this.attachmentsService.findOneAndUpdate(
      { _id: attachmentId, proposalId },
      updateAttachmentDto,
    );
  }

  // DELETE /proposals/:id/attachments/:fk
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, Attachment),
  )
  @Delete("/:id/attachments/:fk")
  async findOneAttachmentAndRemove(
    @Param("id") proposalId: string,
    attachmentId: string,
  ): Promise<unknown> {
    return this.attachmentsService.findOneAndRemove({
      _id: attachmentId,
      proposalId,
    });
  }

  // GET /proposals/:id/datasets
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Dataset))
  @Get("/:id/datasets")
  async findAllDatasets(
    @Param("id") proposalId: string,
  ): Promise<Dataset[] | null> {
    return this.datasetsService.findAll({ where: { proposalId } });
  }
}