// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract HASHGUARD is ERC721, AccessControl {
    uint256 private _tokenIds;

    // RBAC Roles
    bytes32 public constant ROLE_ADMIN = DEFAULT_ADMIN_ROLE;
    bytes32 public constant ROLE_COLLECTOR = keccak256("ROLE_COLLECTOR");
    bytes32 public constant ROLE_ANALYST = keccak256("ROLE_ANALYST");
    bytes32 public constant ROLE_AUDITOR = keccak256("ROLE_AUDITOR");

    // DID Registry: Map user addresses to their DID Document hashes
    mapping(address => bytes32) public didDocuments;

    // Asset Storage mapping
    struct EvidenceMetadata {
        string assetId;
        bytes32 contentHash;
        bytes32 metadataHash;
    }
    mapping(uint256 => EvidenceMetadata) public evidenceAssets;
    
    // Reverse lookup to map string assetId (e.g. EV-1234) to NFT tokenId
    mapping(string => uint256) public assetIdToTokenId;

    event IdentityRegistered(address indexed user, bytes32 didDocumentHash);
    event RoleAssigned(address indexed user, string roleName);
    event EvidenceNFTMinted(uint256 indexed tokenId, string assetId, address indexed to);
    event CustodyTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    event HashVerified(uint256 indexed tokenId, bytes32 expectedHash, bytes32 observedHash, bool valid);
    event AuditorVerified(address indexed auditor, bytes32 credentialHash, bool valid);

    constructor() ERC721("HashGuard Digital Evidence", "HGDE") {
        // Deployer is the super admin
        _grantRole(ROLE_ADMIN, msg.sender);
    }

    // ==========================================
    // 1. DID IDENTITY LAYER (P0)
    // ==========================================
    
    function registerIdentity(bytes32 didDocumentHash) external {
        didDocuments[msg.sender] = didDocumentHash;
        emit IdentityRegistered(msg.sender, didDocumentHash);
    }

    // ==========================================
    // 2. ADMIN-CONFIGURABLE RBAC (P0)
    // ==========================================
    
    function defineRole(bytes32 roleId, bytes32 adminRoleId) external onlyRole(ROLE_ADMIN) {
        _setRoleAdmin(roleId, adminRoleId);
    }

    function assignRole(address account, bytes32 roleId, string calldata roleName) external onlyRole(ROLE_ADMIN) {
        _grantRole(roleId, account);
        emit RoleAssigned(account, roleName);
    }

    // ==========================================
    // 3. EVIDENCE AS NFT (P0)
    // ==========================================
    
    function mintEvidenceNFT(
        address to, 
        string calldata assetId, 
        bytes32 contentHash, 
        bytes32 metadataHash
    ) external onlyRole(ROLE_COLLECTOR) returns (uint256) {
        require(assetIdToTokenId[assetId] == 0, "HASHGUARD: assetId already minted");
        
        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _mint(to, newItemId);

        evidenceAssets[newItemId] = EvidenceMetadata({
            assetId: assetId,
            contentHash: contentHash,
            metadataHash: metadataHash
        });
        
        assetIdToTokenId[assetId] = newItemId;

        emit EvidenceNFTMinted(newItemId, assetId, to);
        return newItemId;
    }

    function transferCustody(uint256 tokenId, address newOwner) external {
        require(ownerOf(tokenId) == msg.sender, "HASHGUARD: Not the custodian");
        _transfer(msg.sender, newOwner, tokenId);
        emit CustodyTransferred(tokenId, msg.sender, newOwner);
    }

    function verifyHash(uint256 tokenId, bytes32 observedHash) external returns (bool) {
        require(_ownerOf(tokenId) != address(0), "HASHGUARD: Evidence does not exist");
        EvidenceMetadata memory asset = evidenceAssets[tokenId];
        bool isValid = (asset.contentHash == observedHash);
        
        emit HashVerified(tokenId, asset.contentHash, observedHash, isValid);
        return isValid;
    }

    // ==========================================
    // 4. VERIFIABLE CREDENTIALS FOR AUDITORS (P1)
    // ==========================================
    
    // Mocks a ZK or VC check where auditor proves credential
    function verifyCredential(bytes32 credentialHash) external onlyRole(ROLE_AUDITOR) returns (bool) {
        // In a real ZK circuit, this would verify a proof.
        // Here we just record the verification interaction.
        bool valid = true;
        emit AuditorVerified(msg.sender, credentialHash, valid);
        return valid;
    }
    
    // ==========================================
    // 5. RETENTION & AUTO-EXPIRY ENGINE
    // ==========================================
    
    event RetentionEvent(
        uint256 indexed tokenId,
        string eventType,      // "archived" | "deleted" | "retention_extended"
        address actor,
        uint256 timestamp
    );

    function logRetentionEvent(uint256 tokenId, string calldata eventType) external {
        require(_ownerOf(tokenId) != address(0), "HASHGUARD: Evidence does not exist");
        // In a real deployment, we restrict this to ROLE_ADMIN or a new ROLE_MANAGER.
        emit RetentionEvent(tokenId, eventType, msg.sender, block.timestamp);
    }
    
    // Needed to resolve AccessControl and ERC165 multiple inheritance
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
